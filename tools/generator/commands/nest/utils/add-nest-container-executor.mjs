import { editJsonFile } from '../../../utils/edit-json-file.mjs';
import { overwriteFile } from '../../../utils/overwrite-file.mjs';
import { getProjects } from '../../../utils/get-projects.mjs';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';

export const addNestContainerExecutor = async (appPath, projectName, type) => {
  console.log(
    '\n\n Add project targets containerize, container-up and Dockerfile\n'
  );

  console.log(`CREATE ${appPath}/Dockerfile`);
  await overwriteFile(
    `${appPath}/Dockerfile`,
    'tools/generator/commands/nest/templates/Dockerfile',
    content =>
      content
        .replace(/{appPath}/g, appPath)
        .replace(/{entryScript}/g, 'main.js')
  );

  console.log(`UPDATE ${appPath}/project.json`);
  await editJsonFile(`${appPath}/project.json`, async content => {
    content.targets['containerize'] = {
      executor: '@nx-tools/nx-container:build',
      options: {
        engine: 'docker',
        'no-cache': true,
        quiet: true,
        load: true,
      },
      configurations: {
        local: {
          metadata: {
            images: [`${projectName}`],
            tags: ['type=raw,value=local'],
          },
        },
        release: {
          metadata: {
            images: [`${projectName}`],
            tags: [
              'type=raw,value=laster',
              'type=ref,enable=true,prefix=,suffix=,event=branch',
              'type=ref,enable=true,prefix=pr,suffix=,event=pr',
              'type=ref,enable=true,prefix=v,suffix=,event=tag',
            ],
          },
        },
      },
      defaultConfiguration: 'local',
    };

    const gatewayProjects = await getProjects({
      projects: '*-gateway',
      type: 'app',
    });
    const port = 2999 + gatewayProjects.length;

    if (type === 'gateway') {
      if (existsSync(`${appPath}/.env`)) {
        console.log(`UPDATE ${appPath}/.env`);
        appendFileSync(`${appPath}/.env`, `\nPORT=${port}`);
      } else {
        console.log(`CREATE ${appPath}/.env`);
        writeFileSync(`${appPath}/.env`, `\nPORT=${port}`);
      }

      console.log(`CREATE ${appPath}/.env.example`);
      writeFileSync(
        `${appPath}/.env.example`,
        `PORT=${port}`,
        readFileSync(`${appPath}/.env.example`)
      );
    }

    console.log(`CREATE ${appPath}/compose.yaml`);
    await overwriteFile(
      `${appPath}/compose.yaml`,
      `tools/generator/commands/nest/templates/compose-${type}.yaml`,
      composeContent =>
        type === 'gateway'
          ? composeContent
              .replace(/{projectName}/g, projectName)
              .replace(/{port}/g, port)
          : composeContent.replace(/{projectName}/g, projectName)
    );

    content.targets['container-up'] = {
      executor: 'nx:run-commands',
      options: {
        commands: [
          `npx nx run ${projectName}:build:production --output-style=stream`,
          `npx nx run ${projectName}:containerize:local --output-style=stream`,
          `npx nx run ${projectName}:container-down --output-style=stream`,
          `docker compose -f ${appPath}/compose.yaml up -d`,
        ],
        parallel: false,
      },
    };

    content.targets['container-down'] = {
      executor: 'nx:run-commands',
      options: {
        commands: [`docker compose -f ${appPath}/compose.yaml down`],
        parallel: false,
      },
    };

    return content;
  });
};
