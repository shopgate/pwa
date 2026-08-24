import {
  getCanSelectColorScheme,
  getDefaultColorSchemeMode,
  getTypographyFontCssUrls,
  getTypographySettings,
  getWidgetLayoutSettings,
} from './appSettings';
import { DEFAULT_APP_SETTINGS } from '../reducers/appSettings';
import type {
  AppearanceSettings,
  AppSettingsState,
  TypographySettings,
  WidgetSettings,
} from '../types/appSettings';

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

const stateWithWidgets = (widgets: WidgetSettings): AppSettingsState => ({
  settings: {
    appSettings: {
      ...DEFAULT_APP_SETTINGS,
      widgets,
    },
  },
});

describe('settings/selectors/appSettings', () => {
  describe('getWidgetLayoutSettings', () => {
    it('returns the configured default margins', () => {
      const layout = {
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 8,
        marginRight: 8,
      };

      expect(getWidgetLayoutSettings(stateWithWidgets({ layout }))).toEqual(layout);
    });

    it('falls back to the defaults when the slice is missing', () => {
      expect(getWidgetLayoutSettings({} as AppSettingsState))
        .toEqual(DEFAULT_APP_SETTINGS.widgets.layout);
    });

    it('falls back to the defaults when the branch is missing', () => {
      const state = {
        settings: { appSettings: { } },
      } as AppSettingsState;

      expect(getWidgetLayoutSettings(state)).toEqual(DEFAULT_APP_SETTINGS.widgets.layout);
    });
  });

  describe('getDefaultColorSchemeMode', () => {
    it('returns the configured color scheme', () => {
      expect(getDefaultColorSchemeMode(stateWithAppearance({ defaultColorSchemeMode: 'dark' }))).toBe('dark');
    });

    it('falls back to the default when the slice is missing', () => {
      expect(getDefaultColorSchemeMode({} as AppSettingsState)).toBe('light');
    });

    it('maps a selectable setting to the system mode', () => {
      expect(getDefaultColorSchemeMode(stateWithAppearance({ defaultColorSchemeMode: 'selectable' }))).toBe('system');
    });

    it('falls back to the default when the branch is missing', () => {
      const state = {
        settings: { appSettings: { } },
      } as AppSettingsState;

      expect(getDefaultColorSchemeMode(state)).toBe('light');
    });
  });

  describe('getCanSelectColorScheme', () => {
    it('allows selecting while the setting is selectable', () => {
      expect(getCanSelectColorScheme(stateWithAppearance({ defaultColorSchemeMode: 'selectable' }))).toBe(true);
    });

    it('does not allow selecting while a color scheme is configured', () => {
      expect(getCanSelectColorScheme(stateWithAppearance({ defaultColorSchemeMode: 'dark' }))).toBe(false);
    });

    it('does not allow selecting when the slice is missing', () => {
      expect(getCanSelectColorScheme({} as AppSettingsState)).toBe(false);
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
