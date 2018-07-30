import { createSelector } from 'reselect';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
const getUiState = state => state.ui;

/**
 * Selects the general UI state.
 * @param {Object} state The global state.
 * @return {Object}
 */
const getGeneralUI = createSelector(
  getUiState,
  uiState => uiState.general
);

const defaultTitle = '';

/**
 * Selects the title from the UI.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getTitle = createSelector(
  getGeneralUI,
  general => general.title || defaultTitle
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
