/**
 * Returns the development configuration.
 * @return {Object} The development configuration.
 */
module.exports = function getDevConfig() {
  const defaultConfig = {
    ip: '127.0.0.0',
    port: 8080,
    apiPort: 9666,
    hmrPort: 3000,
    remotePort: 8000,
    sourceMap: 'cheap-module-eval-source-map',
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
      sourceMap: sourceMapsType,
    };
  } catch (e) {
    return defaultConfig;
  }
};
