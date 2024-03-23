import { overwriteFile } from '../../../utils/overwrite-file.mjs';
import { rmSync } from 'node:fs';

export const updateMicroserviceAppTemplate = async (appPath, projectName) => {
  console.log(`UPDATE ${appPath}/src/main`);
  await overwriteFile(
    `${appPath}/src/main.ts`,
    'tools/generator/commands/nest/templates/microservice.main.ts',
    content => content.replace(/{projectName}/g, projectName)
  );

  console.log(`UPDATE ${appPath}/src/app/app.module.ts`);
  await overwriteFile(
    `${appPath}/src/app/app.module.ts`,
    'tools/generator/commands/nest/templates/microservice.app.module.ts'
  );

  console.log(`UPDATE ${appPath}/src/app/app.service.ts`);
  rmSync(`${appPath}/src/app/app.service.ts`);

  console.log(`UPDATE ${appPath}/src/app/app.service.spec.ts`);
  rmSync(`${appPath}/src/app/app.service.spec.ts`);

  console.log(`UPDATE ${appPath}/src/app/app.controller.ts`);
  rmSync(`${appPath}/src/app/app.controller.ts`);

  console.log(`UPDATE ${appPath}/src/app/app.controller.spec.ts`);
  rmSync(`${appPath}/src/app/app.controller.spec.ts`);
};
