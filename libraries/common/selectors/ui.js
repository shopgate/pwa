import { createSelector } from 'reselect';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { getCurrentState } from './router';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
export const getUiState = state => state.ui;

/**
 * Selects the general UI state.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getGeneralUI = createSelector(
  getUiState,
  uiState => uiState.general
);

/**
 * Selects the title from the UI.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getTitle = createSelector(
  getCurrentState,
  (state) => {
    if (!state || !state.title) {
      return appConfig.shopName;
    }

    return state.title;
  }
);

/**
 * Selects the top status from the UI.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getTopStatus = createSelector(
  getGeneralUI,
  general => general.isTop
);
