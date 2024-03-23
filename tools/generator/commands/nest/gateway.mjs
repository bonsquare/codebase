import chalk from 'chalk';
import { execRun } from '../../utils/exec-run.mjs';
import { ensureAppName } from '../../utils/ensure-app-name.mjs';
import { addNestContainerExecutor } from './utils/add-nest-container-executor.mjs';
import { fixNxNestGeneratorConflict } from './utils/fix-nx-nest-generator-conflict.mjs';

export const gatewayCommand = async name => {
  const { appName, projectName } = await ensureAppName(
    name,
    'gateway service',
    'gateway'
  );
  const appPath = `server/gateways/${projectName}`;

  const args = [
    `--tags=server,gateway`,
    `--skipFormat`,
    `--projectNameAndRootFormat=as-provided`,
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
    await addNestContainerExecutor(appPath, projectName, 'gateway');
    await fixNxNestGeneratorConflict(appPath);
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
