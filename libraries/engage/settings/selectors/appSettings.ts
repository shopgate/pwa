import { createSelector } from 'reselect';
import type { AppSettingsSlice, AppSettingsState } from '../types/appSettings';
import { DEFAULT_APP_SETTINGS } from '../reducers/appSettings';

/**
 * Retrieves the appSettings state from the store. Falls back to the built-in
 * defaults when the slice is not present in the store yet.
 * @param state The current application state.
 * @returns The appSettings state.
 */
export const getAppSettingsState = (state: AppSettingsState): AppSettingsSlice =>
  state?.settings?.appSettings ?? DEFAULT_APP_SETTINGS;

/**
 * Selects whether the app settings have been hydrated from a source
 * (admin sync / jsonp). While `false` the values are the built-in defaults,
 * so consumers should not rely on them and can fall back to the legacy
 * settings system.
 */
export const getAreAppSettingsHydrated = createSelector(
  getAppSettingsState,
  appSettings => appSettings.isHydrated
);

/**
 * Selects the tab bar settings.
 */
export const getTabBarSettings = createSelector(
  getAppSettingsState,
  appSettings => appSettings.navigation.tabBar
);

/**
 * Selects the ProductGrid columns setting (keyed by breakpoint).
 */
export const getProductGridColumns = createSelector(
  getAppSettingsState,
  appSettings => appSettings.productList.grid.columns
);

/**
 * Selects whether the favorites tab bar icon shows the number of favorites within its badge.
 */
export const getShowFavoritesCounter = createSelector(
  getAppSettingsState,
  appSettings => appSettings.navigation.tabBar.favorites.showCounter
);

/**
 * Selects whether rating stars are also shown for products without a rating.
 */
export const getShowEmptyRatingStars = createSelector(
  getAppSettingsState,
  appSettings => appSettings.product.rating.showEmptyStars
);
