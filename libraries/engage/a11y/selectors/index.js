import { createSelector } from 'reselect';

/**
 * Retrieves the a11y state from the store.
 * @param {Object} state The current application state.
 * @return {Object} The a11y state.
 */
const getState = state => state.a11y;

/**
 * Creates a selector that returns the number of currently open modals.
 * @type {(state: any) => number}
 */
export const getModalCount = createSelector(
  getState,
  a11y => a11y.modalCount
);
