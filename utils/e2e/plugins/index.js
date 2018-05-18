const sdkConfig = require('../../../.sgcloud/frontend.json');

module.exports = (on, config) => {
  const ip = sdkConfig.ip || '127.0.0.1';
  const port = sdkConfig.port || 8080;

  // Build a new config object.
  const newConfig = Object.assign({}, config, {
    env: Object.assign({}, config.env, {
      ENVIRONMENT: 'staging',
    }),
  });

  // Set the base URL.
  newConfig.baseUrl = `http://${ip}:${port}`;
  // Set the default timeout.
  newConfig.defaultCommandTimeout = 10000;
  // Set the viewport width.
  newConfig.viewportWidth = 411;
  // Set the viewport height.
  newConfig.viewportHeight = 731;

  return newConfig;
};
