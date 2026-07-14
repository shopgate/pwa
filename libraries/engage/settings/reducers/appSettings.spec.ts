import type { AppSettings } from '../types/appSettings';
import { receiveAppSettings } from '../action-creators/appSettings';
import appSettings, { DEFAULT_APP_SETTINGS } from './appSettings';

describe('settings / reducers / appSettings', () => {
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
    };

    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(settings));

    expect(state.isHydrated).toBe(true);
    expect(state.navigation.tabBar).toEqual(settings.navigation.tabBar);
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

  it('does not mutate the shared defaults constant', () => {
    appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({ navigation: { tabBar: { variant: 'floating' } } } as AppSettings)
    );

    expect(DEFAULT_APP_SETTINGS.navigation.tabBar.variant).toBe('fixed');
    expect(DEFAULT_APP_SETTINGS.isHydrated).toBe(false);
  });
});
