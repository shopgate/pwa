/**
 * Loads DEFAULT_IMAGE_QUALITY against a given theme configuration.
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
    ({ DEFAULT_IMAGE_QUALITY: quality } = require('./imageSettings'));
  });

  return quality;
};

/**
 * Loads DEFAULT_SHOW_INNER_SHADOW against a given app config, for the same reason as above.
 * @param hideProductImageShadow The legacy app config flag.
 * @returns The resolved default.
 */
const loadShowInnerShadow = (hideProductImageShadow: boolean | undefined): boolean => {
  let showInnerShadow = false;

  jest.isolateModules(() => {
    jest.doMock('@shopgate/pwa-common/helpers/config', () => ({
      __esModule: true,
      default: { hideProductImageShadow },
    }));
    jest.doMock('@shopgate/engage/core/config/getThemeSettings', () => ({
      getThemeSettings: () => undefined,
    }));

    // eslint-disable-next-line global-require
    ({ DEFAULT_SHOW_INNER_SHADOW: showInnerShadow } = require('./imageSettings'));
  });

  return showInnerShadow;
};

describe('settings / constants / imageSettings', () => {
  describe('DEFAULT_IMAGE_QUALITY', () => {
    it('takes the quality from the theme configuration', () => {
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

  describe('DEFAULT_SHOW_INNER_SHADOW', () => {
    // The legacy flag is inverted, so the polarity has to survive.
    it.each([
      ['true', true, false],
      ['false', false, true],
      ['unset', undefined, true],
    ])('is %s inverted from the legacy flag', (_, hideProductImageShadow, expected) => {
      expect(loadShowInnerShadow(hideProductImageShadow as boolean | undefined)).toBe(expected);
    });
  });
});
