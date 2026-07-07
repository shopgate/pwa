import { createSelector } from 'reselect';
import type { AppSettings, AppSettingsState } from '../types/appSettings';

/**
 * Retrieves the appSettings state from the store.
 * @param state The current application state.
 * @returns The appSettings state.
 */
export const getAppSettingsState = (state: AppSettingsState): AppSettings =>
  state.settings.appSettings;

/**
 * Selects the card theme settings.
 */
export const getCardSettings = createSelector(
  getAppSettingsState,
  appSettings => appSettings.theme.cards
);

/**
 * Selects the configured card style.
 */
export const getCardStyle = createSelector(
  getCardSettings,
  cards => cards.style
);

/**
 * Selects the configured card background color.
 */
export const getCardBackgroundColor = createSelector(
  getCardSettings,
  cards => cards.backgroundColor
);

/**
 * Selects the configured card padding.
 */
export const getCardPadding = createSelector(
  getCardSettings,
  cards => cards.padding
);
