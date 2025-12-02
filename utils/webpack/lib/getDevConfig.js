/**
 * @typedef {Object} DevConfig
 * @property {string} ip The IP address.
 * @property {number} port The port number.
 * @property {number} apiPort The API port number.
 * @property {number} hmrPort The HMR port number.
 * @property {number} remotePort The remote port number.
 * @property {string} sourceMap The source map type.
 */

/**
 * Returns the development configuration.
 * @return {DevConfig} The development configuration.
 */
module.exports = function getDevConfig() {
  const defaultConfig = {
    ip: '127.0.0.0',
    port: 8080,
    apiPort: 9666,
    hmrPort: 3000,
    remotePort: 8000,
    sourceMap: 'eval-cheap-module-source-map',
  };

  try {
    const {
      ip,
      port,
      apiPort,
      hmrPort,
      remotePort,
      sourceMapsType,
    } = JSON.parse(process.env.settings);

    return {
      ...defaultConfig,
      ip,
      port,
      apiPort,
      hmrPort,
      remotePort,
      // The source map type 'cheap-module-eval-source-map' is renamed to
      // 'eval-cheap-module-source-map' in webpack 5. Since it is the default type created by
      // the platform-sdk, we need to map it here.
      sourceMap: sourceMapsType === 'cheap-module-eval-source-map'
        ? 'eval-cheap-module-source-map'
        : defaultConfig.sourceMap,
    };
  } catch (e) {
    return defaultConfig;
  }
};
