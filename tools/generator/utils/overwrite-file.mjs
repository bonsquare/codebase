import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { workspaceRoot } from '@nx/devkit';
import { join, dirname } from 'path';

export const overwriteFile = async (
  target,
  template,
  callback = content => content
) => {
  const content = await callback(
    readFileSync(join(workspaceRoot, template), 'utf-8')
  );
  const targetDir = dirname(join(workspaceRoot, target));
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  writeFileSync(join(workspaceRoot, target), content);
};
