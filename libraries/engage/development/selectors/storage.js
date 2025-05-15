import { createSelector } from 'reselect';

/**
 * Retrieves the development storage state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The development storage state.
 */
const getState = state => state.development.storage;

/**
 * @typedef {Object} StatusBarStyleStyles
 * @property {string} statusBarBackground Current background color of the app bar
 */

/**
 * @typedef {Object} StatusBarStyle
 * @property {boolean} isDefault Whether the style is the default one which was initially applied
 * @property {"light"|"dark"} statusBarStyle The status style for the iOS status bar
 * @property {StatusBarStyleStyles} styles Additional styles for the status bar
 */

/**
 * Creates a selector that returns the current status bar style object from the storage.
 * @type {(state: any) => StatusBarStyle}
 */
export const getStatusBarStyleStorage = createSelector(
  getState,
  state => state.statusBarStyle
);
