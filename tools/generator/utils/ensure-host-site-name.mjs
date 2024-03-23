import chalk from 'chalk';
import { getProjects } from './get-projects.mjs';

export const ensureHostSiteName = async host => {
  if (!host) {
    return undefined;
  } else {
    host = host.endsWith('-host-site') ? host : `${host}-host-site`;
    const projects = await getProjects();
    if (!projects.includes(host)) {
      console.error(`${chalk.red(`Host site ${host} is not exists!`)}\n\n`);
      process.exit(1);
    }
    return host;
  }
};
