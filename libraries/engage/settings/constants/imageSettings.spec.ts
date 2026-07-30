/**
 * Loads IMAGE_QUALITY against a given theme configuration.
 *
 * The constant is evaluated once at module scope, so the module has to be re-imported in isolation
 * for each case rather than swapping a mock return value between assertions.
 * @param themeSettings What getThemeSettings should return for the AppImages key.
 * @returns The resolved quality.
 */
const loadImageQuality = (themeSettings: unknown): number => {
  // Assigned synchronously inside isolateModules, but TypeScript cannot see that through the
  // callback.
  let quality = 0;

  jest.isolateModules(() => {
    jest.doMock('@shopgate/engage/core/config/getThemeSettings', () => ({
      getThemeSettings: () => themeSettings,
    }));

    // eslint-disable-next-line global-require
    ({ IMAGE_QUALITY: quality } = require('./imageSettings'));
  });

  return quality;
};

describe('settings / constants / imageSettings', () => {
  describe('IMAGE_QUALITY', () => {
    it('takes the quality from the theme configuration', () => {
      // The theme config is the only way to configure this - it is deliberately absent from the
      // appSettings schema.
      expect(loadImageQuality({ quality: 42 })).toBe(42);
    });

    it.each([
      ['undefined', undefined],
      ['an empty object', {}],
      ['a config without a quality', { fillColor: 'FFFFFF,1' }],
    ])('falls back to the built-in default when the theme config is %s', (_, themeSettings) => {
      expect(loadImageQuality(themeSettings)).toBe(75);
    });
  });
});
