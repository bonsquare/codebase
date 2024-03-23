import { editJsonFile } from '../../../utils/edit-json-file.mjs';
import { overwriteFile } from '../../../utils/overwrite-file.mjs';

export const updateAngularBuildDist = async appPath => {
  console.log('\n\n Update project dist directory\n');

  console.log(`UPDATE ${appPath}/src/main.server.ts`);
  await overwriteFile(
    `${appPath}/src/main.server.ts`,
    'tools/generator/commands/angular/templates/main.server.ts',
    content => content.replace(/{appPath}/g, appPath)
  );

  // console.log(`UPDATE ${appPath}/project.json`);
  // await editJsonFile(`${appPath}/project.json`, async content => {
  //   content.targets.build.options = {
  //     ...content.targets.build.options,
  //     outputPath: `${appPath}/dist/browser`,
  //   };
  //   content.targets.server.options = {
  //     ...content.targets.server.options,
  //     outputPath: `${appPath}/dist/server`,
  //   };
  //   return content;
  // });
};
