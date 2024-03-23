const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), config => {
  // Further customize webpack config
  return config;
});
