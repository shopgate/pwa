import { getDefaultColorSchemeMode, getTypographyFontCssUrls, getTypographySettings } from './appSettings';
import { DEFAULT_APP_SETTINGS } from '../reducers/appSettings';
import type { AppearanceSettings, AppSettingsState, TypographySettings } from '../types/appSettings';

const stateWith = (typography: TypographySettings): AppSettingsState => ({
  settings: {
    appSettings: {
      ...DEFAULT_APP_SETTINGS,
      typography,
    },
  },
});

const stateWithAppearance = (appearance: AppearanceSettings): AppSettingsState => ({
  settings: {
    appSettings: {
      ...DEFAULT_APP_SETTINGS,
      appearance,
    },
  },
});

describe('settings/selectors/appSettings', () => {
  describe('getDefaultColorSchemeMode', () => {
    it('returns the configured color scheme', () => {
      expect(getDefaultColorSchemeMode(stateWithAppearance({ defaultColorSchemeMode: 'dark' }))).toBe('dark');
    });

    it('falls back to the default when the slice is missing', () => {
      expect(getDefaultColorSchemeMode({} as AppSettingsState)).toBe('light');
    });

    it('returns the system color scheme', () => {
      expect(getDefaultColorSchemeMode(stateWithAppearance({ defaultColorSchemeMode: 'system' }))).toBe('system');
    });

    it('falls back to the default when the branch is missing', () => {
      const state = {
        settings: { appSettings: { } },
      } as AppSettingsState;

      expect(getDefaultColorSchemeMode(state)).toBe('light');
    });
  });

  describe('getTypographySettings', () => {
    it('falls back to the defaults when the slice is missing', () => {
      expect(getTypographySettings({} as AppSettingsState)).toEqual({ variants: {} });
    });
  });

  describe('getTypographyFontCssUrls', () => {
    it('is empty by default', () => {
      expect(getTypographyFontCssUrls(stateWith({ variants: {} }))).toEqual([]);
    });

    it('puts the global file before the variant ones', () => {
      const urls = getTypographyFontCssUrls(stateWith({
        fontCssUrl: 'global.css',
        variants: {
          h1: { fontCssUrl: 'h1.css' },
          body1: { fontCssUrl: 'body1.css' },
        },
      }));

      expect(urls[0]).toBe('global.css');
      expect(urls).toHaveLength(3);
      expect(urls).toEqual(expect.arrayContaining(['h1.css', 'body1.css']));
    });

    it('returns the variant files when no global one is configured', () => {
      const urls = getTypographyFontCssUrls(stateWith({
        variants: { h1: { fontCssUrl: 'h1.css' } },
      }));

      expect(urls).toEqual(['h1.css']);
    });

    it('lists a url once when it is configured globally and for a variant', () => {
      const urls = getTypographyFontCssUrls(stateWith({
        fontCssUrl: 'brand.css',
        variants: {
          h1: { fontCssUrl: 'brand.css' },
          h2: { fontCssUrl: 'display.css' },
        },
      }));

      expect(urls).toEqual(['brand.css', 'display.css']);
    });

    it('lists a url once when two variants share it', () => {
      const urls = getTypographyFontCssUrls(stateWith({
        variants: {
          h1: { fontCssUrl: 'display.css' },
          h2: { fontCssUrl: 'display.css' },
        },
      }));

      expect(urls).toEqual(['display.css']);
    });

    it('drops variants that carry no url', () => {
      const urls = getTypographyFontCssUrls(stateWith({
        fontCssUrl: '',
        variants: {
          h1: {},
          h2: { fontCssUrl: 'h2.css' },
          h3: { fontCssUrl: undefined },
        },
      }));

      expect(urls).toEqual(['h2.css']);
    });
  });
});
