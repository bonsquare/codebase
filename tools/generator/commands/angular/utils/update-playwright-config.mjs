import { getProjectConfig } from '../../../utils/get-project-config.mjs';
import { overwriteFile } from '../../../utils/overwrite-file.mjs';

export const updatePlaywrightConfig = async (appPath, projectName) => {
  console.log('\n\n Update angular e2e playwright config\n');
  const projectConfig = await getProjectConfig(projectName);
  console.log(`UPDATE ${appPath}-e2e/playwright.config.ts`);
  await overwriteFile(
    `${appPath}-e2e/playwright.config.ts`,
    'tools/generator/commands/angular/templates/playwright.config.ts',
    content =>
      content
        .replace(/{projectName}/g, projectName)
        .replace(/{port}/g, projectConfig.targets.serve.options.port)
  );
};
