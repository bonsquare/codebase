import { editJsonFile } from '../../../utils/edit-json-file.mjs';
import { overwriteFile } from '../../../utils/overwrite-file.mjs';

export const addAngularContainerExecutor = async (appPath, projectName) => {
  console.log(
    '\n\n Add project targets containerize, container-up and Dockerfile\n'
  );

  console.log(`CREATE .docker/${appPath}/Dockerfile`);
  await overwriteFile(
    `.docker/${appPath}/Dockerfile`,
    'tools/generator/commands/angular/templates/Dockerfile',
    content => content.replace(/{appPath}/g, appPath)
  );

  console.log(`UPDATE ${appPath}/project.json`);
  await editJsonFile(`${appPath}/project.json`, async content => {
    content.targets['docker'] = {
      executor: '@nx-tools/nx-container:build',
      options: {
        engine: 'docker',
        load: true,
        push: false,
        file: `.docker/${projectName}/Dockerfile`,
        tags: [`${projectName}:local`],
      },
    };
    content.targets['docker-compose-up'] = {
      executor: 'nx:run-commands',
      options: {
        commands: [
          `npx nx run-many --projects=${projectName} --targets=server,docker-compose-down --output-style=stream-without-prefixes`,
          `npx nx run ${projectName}:docker --output-style=stream-without-prefixes`,
          `docker compose -f .docker/${appPath}/compose.yaml up -d`,
        ],
        parallel: false,
      },
    };
    content.targets['docker-compose-down'] = {
      executor: 'nx:run-commands',
      options: {
        commands: [`docker compose -f .docker/${appPath}/compose.yaml down`],
        parallel: false,
      },
    };

    content.targets['deploy-docker'] = {
      executor: '@nx-tools/nx-container:build',
      options: {
        engine: 'docker',
        load: false,
        push: true,
        metadata: {
          images: [`bonsquare/${projectName}`],
          tags: [
            'type=ref,enable=true,prefix=,suffix=,event=branch',
            'type=ref,enable=true,prefix=pr,suffix=,event=pr',
            'type=ref,enable=true,prefix=v,suffix=,event=tag',
          ],
        },
      },
    };

    console.log(`CREATE .docker/${appPath}/compose.yaml`);
    await overwriteFile(
      `.docker/${appPath}/compose.yaml`,
      'tools/generator/commands/angular/templates/compose.yaml',
      composeContent =>
        composeContent
          .replace(/{projectName}/g, projectName)
          .replace(/{port}/g, content.targets.serve.options.port)
    );

    return content;
  });
};
