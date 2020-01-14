/* eslint-disable global-require, no-console */

module.exports = (on, config) => {
  let ip;
  let port;

  if (process.env.IP && process.env.PORT) {
    ip = process.env.IP;
    port = process.env.PORT;
  } else if (!process.env.BC) {
    const sdkConfig = require('../../../.sgcloud/frontend.json');
    ip = sdkConfig.ip || '127.0.0.1';
    port = sdkConfig.port || 8080;

    console.warn(ip, port);
  }

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

  if (process.env.BC) {
    newConfig.baseUrl = process.env.BC;
  }

  on('task', {
    log(message) {
      console.log(`${'='.repeat(20)}\n${message}\n${'='.repeat(20)}`);
      return null;
    },
  });

  return newConfig;
};

/* eslint-enable global-require, no-console */
