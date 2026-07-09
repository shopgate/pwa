import { createSelector } from 'reselect';
import type { AppSettingsSlice, AppSettingsState } from '../types/appSettings';

/**
 * Retrieves the appSettings state from the store.
 * @param state The current application state.
 * @returns The appSettings state.
 */
export const getAppSettingsState = (state: AppSettingsState): AppSettingsSlice =>
  state.settings.appSettings;

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
 * Selects the menubar settings.
 */
export const getMenubarSettings = createSelector(
  getAppSettingsState,
  appSettings => appSettings.navigation.menubar
);
