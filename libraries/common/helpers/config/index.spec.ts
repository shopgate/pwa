/**
 * Loads a fresh copy of the config module with a deployed app config.
 * @param deployedConfig What the build injects as APP_CONFIG.
 * @returns The resolved app config.
 */
const loadAppConfig = (deployedConfig: Record<string, unknown>): Record<string, unknown> => {
  let appConfig: Record<string, unknown> = {};

  jest.replaceProperty(process, 'env', {
    ...process.env,
    NODE_ENV: 'production',
    APP_CONFIG: deployedConfig as unknown as string,
  });

  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    ({ default: appConfig } = require('./index'));
  });

  return appConfig;
};

describe('appConfig', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should always provide hasFavorites as true', () => {
    expect(loadAppConfig({
      appId: 'shop_10006',
      theme: { shadows: {} },
    }).hasFavorites).toBe(true);
  });

  it('should ignore a deployed hasFavorites of false', () => {
    expect(loadAppConfig({
      appId: 'shop_10006',
      theme: { shadows: {} },
      hasFavorites: false,
    }).hasFavorites).toBe(true);
  });
});
