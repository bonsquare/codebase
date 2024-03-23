import prompts from 'prompts';
import chalk from 'chalk';
import { capitalizeFirstChar } from './capitalize-first-char.mjs';
import { getProjects } from '../utils/get-projects.mjs';

export const ensureAppName = async (name, type, postfix) => {
  if (!name) {
    name = (
      await prompts({
        type: 'text',
        name: 'appName',
        message: `What's name of ${type.toLowerCase()} project?`,
      })
    ).appName;
    if (!name) {
      console.error(
        `\n${chalk.red(
          `${capitalizeFirstChar(
            type.toLowerCase()
          )} project's name can't be blank!`
        )}\n`
      );
      process.exit(0);
    }
  }

  let appName;
  let projectName;
  if (!name.endsWith(`-${postfix}`)) {
    appName = name;
    projectName = `${name}-${postfix}`;
  } else {
    appName = name.slice(0, name.lastIndexOf(`-${postfix}`));
    projectName = name;
  }

  const projects = await getProjects();
  if (projects.includes(projectName)) {
    console.error(`${chalk.red(`Project ${projectName} already exists!`)}\n\n`);
    process.exit(1);
  }

  return { appName, projectName };
};
