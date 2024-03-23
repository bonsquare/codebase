import { editJsonFile } from '../../../utils/edit-json-file.mjs';
import { overwriteFile } from '../../../utils/overwrite-file.mjs';

export const addAngularVercelExecutor = async appPath => {
  console.log(
    '\n\n Add project targets containerize, container-up and Dockerfile\n'
  );

  console.log(`CREATE .vercel/${appPath}/vercel.json`);
  await overwriteFile(
    `.vercel/${appPath}/vercel.json`,
    'tools/generator/commands/angular/templates/vercel.json',
    content => content.replace(/{appPath}/g, appPath)
  );

  console.log(`CREATE .vercel/${appPath}/api./index.js`);
  await overwriteFile(
    `.vercel/${appPath}/api/index.js`,
    'tools/generator/commands/angular/templates/vercel.api.index.js',
    content => content.replace(/{appPath}/g, appPath)
  );

  // console.log(`UPDATE ${appPath}/project.json`);
  // await editJsonFile(`${appPath}/project.json`, async content => {
  //   return content;
  // });
};
