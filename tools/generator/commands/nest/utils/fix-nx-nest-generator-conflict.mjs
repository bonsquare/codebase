import { editJsonFile } from '../../../utils/edit-json-file.mjs';
import { workspaceRoot } from '@nx/devkit';
import { overwriteFile } from '../../../utils/overwrite-file.mjs';

/**  Fix this issue: https://github.com/nrwl/nx/issues/22476  */
export const fixNxNestGeneratorConflict = async appPath => {
  console.log(`UPDATE ${workspaceRoot}/nx.json`);
  await editJsonFile(`${workspaceRoot}/nx.json`, async content => {
    return {
      ...content,
      plugins: content.plugins.filter(
        plugin => plugin.plugin !== '@nx/webpack/plugin'
      ),
    };
  });

  console.log(`UPDATE ${appPath}/webpackConfig.config.js`);
  await overwriteFile(
    `${appPath}/webpackConfig.config.js`,
    'tools/generator/commands/nest/templates/webpackConfig.config.js'
  );

  console.log(`UPDATE ${appPath}/project.json`);
  await editJsonFile(`${appPath}/project.json`, async content => {
    content.targets = {
      build: {
        executor: '@nx/webpack:webpack',
        options: {
          outputPath: 'dist/server/gateways/api-gateway',
          main: 'server/gateways/api-gateway/src/main.ts',
          tsConfig: 'server/gateways/api-gateway/tsconfig.app.json',
          assets: ['server/gateways/api-gateway/src/assets'],
          target: 'node',
          compiler: 'tsc',
          sourceMap: true,
          webpackConfig: 'server/gateways/api-gateway/webpack.config.js',
        },
        configurations: {
          production: {
            optimization: true,
          },
          development: {
            optimization: false,
          },
        },
        defaultConfiguration: 'production',
      },
      ...content.targets,
    };
    return content;
  });
};
