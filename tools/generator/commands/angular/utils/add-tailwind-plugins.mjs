import { overwriteFile } from '../../../utils/overwrite-file.mjs';

export const addTailwindPlugin = async appPath => {
  console.log('\n\n Add tailwind plugins\n');
  console.log(`UPDATE ${appPath}/tailwind.config.js`);
  await overwriteFile(
    `${appPath}/tailwind.config.js`,
    'tools/generator/commands/angular/templates/tailwind.config.js'
  );
};
