import { join } from 'path';
import { editJsonFile } from '../../../utils/edit-json-file.mjs';

export const fixAngularTsTargetWarning = async appPath => {
  console.log('\n\n Add angular tsconfig target warning\n');

  await Promise.all([
    editJsonFile(join(appPath, 'tsconfig.json'), content => {
      content.compilerOptions.target = 'ES2022';
      return content;
    }),
    editJsonFile(join(appPath, 'tsconfig.app.json'), content => {
      content.compilerOptions.target = 'ES2022';
      return content;
    }),
    editJsonFile(join(appPath, 'tsconfig.server.json'), content => {
      content.compilerOptions.target = 'ES2022';
      return content;
    }),
  ]);

  console.log(`UPDATE ${appPath}/tsconfig.json`);
  console.log(`UPDATE ${appPath}/tsconfig.app.json`);
  console.log(`UPDATE ${appPath}/tsconfig.server.json`);
};
