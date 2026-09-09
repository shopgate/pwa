import { logger } from '@shopgate/pwa-core/helpers';
import type { AppSettings, AppSettingsPayload } from '../types/appSettings';
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

  it('defaults to hiding empty rating stars', () => {
    // Only reachable once hydrated, so it matches the admin default rather than the legacy one.
    expect(DEFAULT_APP_SETTINGS.product.rating.showEmptyStars).toBe(false);
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
          favorites: {
            showCounter: false,
          },
        },
      },
      product: {
        grid: {
          columns: {
            small: 1,
            large: 3,
          },
        },
        slider: {
          slidesPerView: {
            small: 1.2,
            medium: 2.2,
            large: 3.2,
          },
        },
        rating: {
          showEmptyStars: false,
        },
        card: {
          productName: { maxLines: 1 },
        },
        tile: {
          productName: { maxLines: 4 },
        },
      },
      cards: {
        style: 'border',
        shadow: { size: 'low' },
      },
      typography: {
        fontCssUrl: 'https://cdn.example/fonts.css',
        variants: {
          h1: { fontCssUrl: 'https://cdn.example/h1.css' },
        },
      },
      images: {
        quality: 75,
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
      appearance: {
        defaultColorSchemeMode: 'dark',
      },
      widgets: {
        mediaMargins: {
          top: 16,
          bottom: 16,
          left: 8,
          right: 8,
        },
      },
    };

    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(settings));

    expect(state.isHydrated).toBe(true);
    expect(state.navigation.tabBar).toEqual(settings.navigation.tabBar);
    expect(state.product).toEqual(settings.product);
    expect(state.cards).toEqual(settings.cards);
    expect(state.appearance).toEqual(settings.appearance);
    expect(state.widgets).toEqual(settings.widgets);
  });

  it('defaults the media widget margins to zero', () => {
    expect(DEFAULT_APP_SETTINGS.widgets.mediaMargins).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  it('deep merges a partial media margins payload', () => {
    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings({
      widgets: { mediaMargins: { top: 24 } },
    }));

    expect(state.widgets.mediaMargins).toEqual({
      top: 24,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  it('keeps the widget defaults when the branch is cleared', () => {
    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings({
      widgets: null,
    } as unknown as AppSettingsPayload));

    expect(state.widgets).toEqual(DEFAULT_APP_SETTINGS.widgets);
  });

  it('keeps the default of a single cleared side', () => {
    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings({
      widgets: {
        mediaMargins: {
          top: 16,
          bottom: null,
        },
      },
    } as unknown as AppSettingsPayload));

    expect(state.widgets.mediaMargins).toEqual({
      top: 16,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  it('keeps the widget defaults when only the media margins are cleared', () => {
    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings({
      widgets: { mediaMargins: null },
    } as unknown as AppSettingsPayload));

    expect(state.widgets).toEqual(DEFAULT_APP_SETTINGS.widgets);
  });

  it('defaults the color scheme to light', () => {
    const state = appSettings(undefined, { type: '@@INIT' });

    expect(state.appearance.defaultColorSchemeMode).toBe('light');
  });

  it('stores the system color scheme', () => {
    const state = appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({ appearance: { defaultColorSchemeMode: 'selectable' } })
    );

    expect(state.appearance.defaultColorSchemeMode).toBe('selectable');
  });

  it('keeps the appearance defaults when the branch is cleared', () => {
    const state = appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({ appearance: null } as unknown as AppSettingsPayload)
    );

    expect(state.appearance).toEqual({ defaultColorSchemeMode: 'light' });
  });

  it('keeps the color scheme default when only the field is cleared', () => {
    const state = appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({
        appearance: { defaultColorSchemeMode: null },
      } as unknown as AppSettingsPayload)
    );

    expect(state.appearance.defaultColorSchemeMode).toBe('light');
  });

  it('keeps the typography defaults when the branch is cleared', () => {
    // The preview clears a branch by sending a null. Without mapping it to undefined the slice
    // would hold null and getTypographyFontCssUrls would throw reading it.
    const state = appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({ typography: null } as unknown as AppSettingsPayload)
    );

    expect(state.typography).toEqual({ variants: {} });
  });

  it('keeps the variants default when only the variants are cleared', () => {
    const state = appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({ typography: { variants: null } } as unknown as AppSettingsPayload)
    );

    expect(state.typography.variants).toEqual({});
  });

  it('deep merges a partial payload over the defaults', () => {
    // The admin preview may send only the fields the merchant changed. Anything
    // omitted must keep its default so consumers never read undefined.
    const partial: AppSettingsPayload = {
      navigation: { tabBar: { variant: 'floating' } },
    };

    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

    expect(state.isHydrated).toBe(true);
    expect(state.navigation.tabBar).toEqual({
      variant: 'floating',
      transition: DEFAULT_APP_SETTINGS.navigation.tabBar.transition,
      showLabels: DEFAULT_APP_SETTINGS.navigation.tabBar.showLabels,
      hideOnScroll: DEFAULT_APP_SETTINGS.navigation.tabBar.hideOnScroll,
      fixed: DEFAULT_APP_SETTINGS.navigation.tabBar.fixed,
      favorites: DEFAULT_APP_SETTINGS.navigation.tabBar.favorites,
    });
  });

  it('resets fields a later payload omits back to their default', () => {
    // The admin preview drops the fields of inputs its visibility conditions hide, so selecting the
    // flat card style stops sending a shadow size. The elevation of the previous payload must not
    // survive that, or the preview keeps drawing a shadow on a flat card.
    const withShadow = appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({
        cards: { shadow: { size: 'strong' } },
      })
    );

    expect(withShadow.cards.shadow.size).toBe('strong');

    const withoutShadow = appSettings(
      withShadow,
      receiveAppSettings({ cards: {} })
    );

    expect(withoutShadow.cards.shadow.size)
      .toBe(DEFAULT_APP_SETTINGS.cards.shadow.size);
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

    it('applies an incoming quality', () => {
      const partial = { images: { quality: 40 } } as AppSettings;

      const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

      expect(state.images.quality).toBe(40);
    });

    it('keeps the default quality when the payload omits it', () => {
      const partial = { images: { fillColor: 'white' } } as AppSettings;

      const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

      expect(state.images.quality).toBe(DEFAULT_APP_SETTINGS.images.quality);
    });

    it.each([
      ['an empty string', '', DEFAULT_APP_SETTINGS.images.quality],
      ['not a number', 'abc', DEFAULT_APP_SETTINGS.images.quality],
      ['above the range', 1000, 100],
      ['below the range', 0, 1],
    ])('sanitizes a quality that is %s', (_, quality, expected) => {
      // The admin dispatches on every keystroke, so half typed values reach the reducer and would
      // otherwise end up in an image service url.
      const partial = { images: { quality } } as unknown as AppSettings;

      const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(partial));

      expect(state.images.quality).toBe(expected);
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

    // The admin preview dispatches repeatedly, so a reset arrives on top of whatever the merchant
    // configured before it - and a merge on its own would only add to that.
    it.each([
      ['the whole branch', { images: null }],
      ['the product branch', { images: { product: null } }],
    ])('drops earlier configuration when a source clears %s', (_, partial) => {
      const configured = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings({
        images: {
          quality: 40,
          product: {
            ratio: {
              width: 4,
              height: 5,
            },
            pdp: {
              ratio: {
                width: 1,
                height: 2,
              },
            },
          },
        },
      } as AppSettings));

      const state = appSettings(configured, receiveAppSettings(partial as unknown as AppSettings));

      expect(state.images.product).toEqual(DEFAULT_APP_SETTINGS.images.product);
      expect(state.images.product.pdp).toBeUndefined();
    });

    it.each([
      ['the whole branch', { images: null }],
      ['the product branch', { images: { product: null } }],
    ])('restores the defaults when a source clears %s', (_, partial) => {
      const state = appSettings(
        DEFAULT_APP_SETTINGS,
        receiveAppSettings(partial as unknown as AppSettings)
      );

      expect(state.images).toEqual(DEFAULT_APP_SETTINGS.images);
      expect(state.isHydrated).toBe(true);
    });

    // The substituted branch is read from the defaults constant, so a later payload writing into
    // it must not reach back and change them.
    it('leaves the defaults untouched after restoring a cleared branch', () => {
      const restored = appSettings(
        DEFAULT_APP_SETTINGS,
        receiveAppSettings({ images: { product: null } } as unknown as AppSettings)
      );

      appSettings(restored, receiveAppSettings({
        images: {
          product: {
            ratio: {
              width: 4,
              height: 5,
            },
          },
        },
      } as AppSettings));

      expect(DEFAULT_APP_SETTINGS.images.product.ratio).toEqual({
        width: 1,
        height: 1,
      });
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
      receiveAppSettings({ navigation: { tabBar: { variant: 'floating' } } })
    );

    expect(DEFAULT_APP_SETTINGS.navigation.tabBar.variant).toBe('fixed');
    expect(DEFAULT_APP_SETTINGS.isHydrated).toBe(false);
  });
});
