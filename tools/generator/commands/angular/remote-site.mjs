import chalk from 'chalk';
import { execRun } from '../../utils/exec-run.mjs';
import { ensureAppName } from '../../utils/ensure-app-name.mjs';
import { fixAngularTsTargetWarning } from './utils/fix-angular-ts-target-warning.mjs';
import { addTailwindPlugin } from './utils/add-tailwind-plugins.mjs';
import { addAngularContainerExecutor } from './utils/add-angular-container-executor.mjs';
import { ensureHostSiteName } from './utils/ensure-host-site-name.mjs';
import { addDevRemotesToHostSite } from './utils/add-dev-remotes-to-host-site.mjs';
import { updatePlaywrightConfig } from './utils/update-playwright-config.mjs';
import { resetNxWorkspace } from '../../utils/reset-nx-workspace.mjs';
import { updateAngularBuildDist } from './utils/update-angular-build-dist.mjs';
import { addAngularVercelExecutor } from './utils/add-angular-vercel-executor.mjs';

export const remoteSiteCommand = async (name, host) => {
  const { appName, projectName } = await ensureAppName(
    name,
    'remote module fer',
    'module'
  );
  host = await ensureHostSiteName(host);
  const appPath = `website/remotes/${projectName}`;
  const args = [
    host ? `--host=${host}` : '',
    `--ssr`,
    `--standalone`,
    `--addTailwind`,
    `--style=scss`,
    `--skipFormat`,
    `--e2eTestRunner=playwright`,
    `--projectNameAndRootFormat=as-provided`,
    `--tags=website,micro-site`,
    `--prefix=${appName}`,
    `${appPath}`,
  ];

  try {
    console.log(await execRun(`npx nx g @nx/angular:remote ${args.join(' ')}`));
    console.log(
      await execRun(
        `npx nx g nx-stylelint:configuration --project ${projectName} --scss --formatter string --skipFormat`
      )
    );
  } catch (err) {
    console.error(`${chalk.red(`Can't create project via nx!`)}\n`);
    console.error(err);
    process.exit(1);
  }

  try {
    await fixAngularTsTargetWarning(appPath);
    await addTailwindPlugin(appPath);
    await addAngularContainerExecutor(appPath, projectName);
    if (host) await addDevRemotesToHostSite(host, projectName);
    await updatePlaywrightConfig(appPath, projectName);
    await updateAngularBuildDist(appPath);
    await addAngularVercelExecutor(appPath);
  } catch (err) {
    console.error(`${chalk.red(`Have an error while overide nx project!`)}\n`);
    console.error(err);
    await execRun(`npx nx g @nx/workspace:remove ${projectName}-e2e`);
    await execRun(`npx nx g @nx/workspace:remove ${projectName}`);
    rmSync(`.docker/${appPath}`);
    rmSync(`.vercel/${appPath}`);
    process.exit(1);
  }

  try {
    await execRun(`npx nx format:write  --projects=${projectName}`);
    await resetNxWorkspace();
  } catch (err) {
    console.warn(
      `${chalk.yellow(`Have an error while format project file!`)}\n`
    );
  }

  console.log('\n\nFinished!!!\n');
};
