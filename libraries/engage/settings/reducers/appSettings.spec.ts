import { logger } from '@shopgate/pwa-core/helpers';
import type { AppSettings } from '../types/appSettings';
import { receiveAppSettings } from '../action-creators/appSettings';
import appSettings, { DEFAULT_APP_SETTINGS } from './appSettings';

// Several cases feed the reducer a fill color it is meant to reject, which logs a real warning.
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: { warn: jest.fn() },
}));

describe('settings / reducers / appSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the built-in defaults as initial state', () => {
    const state = appSettings(undefined, { type: '@@INIT' });

    expect(state).toEqual(DEFAULT_APP_SETTINGS);
    expect(state.isHydrated).toBe(false);
  });

  it('ignores unrelated actions', () => {
    const state = appSettings(DEFAULT_APP_SETTINGS, { type: 'SOME_OTHER_ACTION' });

    expect(state).toBe(DEFAULT_APP_SETTINGS);
  });

  it('hydrates from a full payload and flags isHydrated', () => {
    const settings: AppSettings = {
      navigation: {
        tabBar: {
          variant: 'floating',
          transition: 'slide',
          showLabels: false,
          hideOnScroll: true,
          fixed: {
            borderEnabled: false,
          },
        },
      },
      productList: {
        grid: {
          columns: {
            xs: 1,
            md: 3,
          },
        },
      },
      images: {
        fillColor: 'FFFFFF',
        fillTransparent: true,
        product: {
          ratio: {
            width: 1,
            height: 1,
          },
          showInnerShadow: false,
        },
      },
    };

    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(settings));

    expect(state.isHydrated).toBe(true);
    expect(state.navigation.tabBar).toEqual(settings.navigation.tabBar);
    expect(state.productList.grid.columns).toEqual(settings.productList.grid.columns);
  });

  it('deep merges a partial payload over the defaults', () => {
    // The admin preview may send only the fields the merchant changed. Anything
    // omitted must keep its default so consumers never read undefined.
    const partial = {
      navigation: { tabBar: { variant: 'floating' } },
    } as AppSettings;

    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

    expect(state.isHydrated).toBe(true);
    expect(state.navigation.tabBar).toEqual({
      variant: 'floating',
      transition: DEFAULT_APP_SETTINGS.navigation.tabBar.transition,
      showLabels: DEFAULT_APP_SETTINGS.navigation.tabBar.showLabels,
      hideOnScroll: DEFAULT_APP_SETTINGS.navigation.tabBar.hideOnScroll,
      fixed: DEFAULT_APP_SETTINGS.navigation.tabBar.fixed,
    });
  });

  describe('images', () => {
    it('deep merges a partial images payload', () => {
      const partial = {
        images: {
          product: {
            ratio: {
              width: 4,
              height: 5,
            },
          },
        },
      } as AppSettings;

      const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

      expect(state.images.product.ratio).toEqual({
        width: 4,
        height: 5,
      });
      expect(state.images.fillColor).toBe(DEFAULT_APP_SETTINGS.images.fillColor);
    });

    it('converts an incoming fill color into the image service format', () => {
      // The value reaches the store exactly as the source sent it - any CSS color - and is
      // converted here, so everything reading the slice gets a wire ready value.
      const partial = { images: { fillColor: 'rgb(255, 84, 0)' } } as AppSettings;

      const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

      expect(state.images.fillColor).toBe('FF5400');
    });

    it('leaves the default fill color alone when the payload omits images', () => {
      const partial = { navigation: { tabBar: { variant: 'floating' } } } as AppSettings;

      const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

      expect(state.images.fillColor).toBe(DEFAULT_APP_SETTINGS.images.fillColor);
    });

    it('falls back to the default when the fill color cannot be parsed', () => {
      const partial = { images: { fillColor: 'not-a-color' } } as AppSettings;

      const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

      expect(state.images.fillColor).toBe('FFFFFF');
      expect(logger.warn).toHaveBeenCalled();
    });

    it.each([
      ['an empty string', ''],
      ['null', null],
    ])('falls back to the default when the fill color is %s', (_, fillColor) => {
      // merge overwrites with these, unlike undefined, so they reach the slice and would produce a
      // malformed "fill=" parameter if they were not converted.
      const partial = { images: { fillColor } } as unknown as AppSettings;

      const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

      expect(state.images.fillColor).toBe('FFFFFF');
    });

    it('is idempotent across repeated hydrations', () => {
      // The admin preview bridge dispatches on every edit, so an already converted value gets fed
      // back through the reducer.
      const partial = { images: { fillColor: 'white' } } as AppSettings;

      const once = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));
      const twice = appSettings(once, receiveAppSettings({} as AppSettings));

      expect(once.images.fillColor).toBe('FFFFFF');
      expect(twice.images.fillColor).toBe('FFFFFF');
    });
  });

  it('does not mutate the shared defaults constant', () => {
    appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({ navigation: { tabBar: { variant: 'floating' } } } as AppSettings)
    );

    expect(DEFAULT_APP_SETTINGS.navigation.tabBar.variant).toBe('fixed');
    expect(DEFAULT_APP_SETTINGS.isHydrated).toBe(false);
  });
});
