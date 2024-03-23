import { execRun } from './exec-run.mjs';

export const resetNxWorkspace = async () => {
  await execRun(`npx nx reset && npx nx daemon --start`);
};
