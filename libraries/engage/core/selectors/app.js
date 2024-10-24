import { createSelector } from 'reselect';

/**
 * Retrieves the app state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The locations state.
 */
const getState = state => state.app;

/**
 * Checks if the app webview is currently visible
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const getIsAppWebViewVisible = createSelector(
  getState,
  app => app.webViewVisible
);
