import type { AppSettings, AppSettingsPayload } from '../types/appSettings';
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
      productList: {
        grid: {
          columns: {
            xs: 1,
            md: 3,
          },
        },
        card: {
          productName: { maxLines: 1 },
        },
        tile: {
          productName: { maxLines: 4 },
          shadow: {
            size: 'strong',
          },
        },
      },
      cards: {
        style: 'border',
        shadow: { size: 'low' },
      },
    };

    const state = appSettings(DEFAULT_APP_SETTINGS, receiveAppSettings(settings));

    expect(state.isHydrated).toBe(true);
    expect(state.navigation.tabBar).toEqual(settings.navigation.tabBar);
    expect(state.productList.grid.columns).toEqual(settings.productList.grid.columns);
    expect(state.cards).toEqual(settings.cards);
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

  it('does not mutate the shared defaults constant', () => {
    appSettings(
      DEFAULT_APP_SETTINGS,
      receiveAppSettings({ navigation: { tabBar: { variant: 'floating' } } })
    );

    expect(DEFAULT_APP_SETTINGS.navigation.tabBar.variant).toBe('fixed');
    expect(DEFAULT_APP_SETTINGS.isHydrated).toBe(false);
  });
});
