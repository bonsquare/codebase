import { editJsonFile } from '../../../utils/edit-json-file.mjs';
import { getProjectConfig } from '../../../utils/get-project-config.mjs';
import { dirname } from 'node:path';
import { execRun } from '../../../utils/exec-run.mjs';

export const addDevRemotesToHostSite = async (
  hostProjectName,
  remoteProjectName
) => {
  console.log('\n\n Add dev remote to host project\n');

  const projectConfig = await getProjectConfig(hostProjectName);
  const hostProjectPath = projectConfig.sourceRoot;

  await editJsonFile(`${dirname(hostProjectPath)}/project.json`, content => {
    content.targets.serve.options = {
      ...content.targets.serve.options,
      devRemotes: [
        ...(content.targets.serve.options.devRemotes ?? []),
        remoteProjectName,
      ],
    };

    // filter unique
    content.targets.serve.options.devRemotes =
      content.targets.serve.options.devRemotes.filter((value, index, array) => {
        return array.indexOf(value) === index;
      });

    return content;
  });

  await execRun(`npx nx format:write  --projects=${hostProjectName}`);
};
