import { execRun } from './exec-run.mjs';

export const getProjectConfig = async (name, options = {}) => {
  const args = [];
  for (const key in options) {
    args.push(`--${key} ${object[key]}`);
  }
  return JSON.parse(
    await execRun(`npx nx show project ${name} ${args.join(' ')}`)
  );
};
