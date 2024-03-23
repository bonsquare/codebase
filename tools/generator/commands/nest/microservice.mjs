import chalk from 'chalk';
import { execRun } from '../../utils/exec-run.mjs';
import { ensureAppName } from '../../utils/ensure-app-name.mjs';
import { addNestContainerExecutor } from './utils/add-nest-container-executor.mjs';
import { fixNxNestGeneratorConflict } from './utils/fix-nx-nest-generator-conflict.mjs';
import { updateMicroserviceAppTemplate } from './utils/update-microservice-app-template.mjs';

export const microserviceCommand = async name => {
  const { appName, projectName } = await ensureAppName(
    name,
    'microservice',
    'service'
  );
  const appPath = `server/services/${projectName}`;
  const args = [
    `--tags=server,microservice`,
    `--projectNameAndRootFormat=as-provided`,
    `--skipFormat`,
    `--name=${projectName}`,
    `--directory=${appPath}`,
  ];
  try {
    console.log(
      await execRun(`npx nx g @nx/nest:application ${args.join(' ')}`)
    );
  } catch (err) {
    console.error(`${chalk.red(`Can't create project via nx!`)}\n`);
    console.error(err);
    process.exit(1);
  }

  try {
    await addNestContainerExecutor(appPath, projectName, 'microservice');
    await fixNxNestGeneratorConflict(appPath);
    await updateMicroserviceAppTemplate(appPath, projectName);
  } catch (err) {
    console.error(`${chalk.red(`Have an error while overide nx project!`)}\n`);
    console.error(err);
    await execRun(`npx nx g @nx/workspace:remove ${projectName}-e2e`);
    await execRun(`npx nx g @nx/workspace:remove ${projectName}`);
    process.exit(1);
  }

  try {
    await execRun(`npx nx format:write  --projects=${projectName}`);
  } catch (err) {
    console.warn(
      `${chalk.yellow(`Have an error while format project file!`)}\n`
    );
  }

  console.log('\n\nFinished!!!\n');
};
