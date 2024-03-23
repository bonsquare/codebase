import { execRun } from './exec-run.mjs';

export const getProjects = async options => {
  const args = ['--json'];
  for (const key in options) {
    args.push(`--${key} ${options[key]}`);
  }
  return JSON.parse(await execRun(`npx nx show projects ${args.join(' ')}`));
};
