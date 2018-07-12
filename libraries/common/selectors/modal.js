import { createSelector } from 'reselect';

/**
 * Returns modal state (state.modal)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getModalState = state => state.modal || [];

/**
 * Returns the first modal of the current modal stack.
 * @return {Object|undefined}
 */
export const getFirstModal = createSelector(
  getModalState,
  modals => modals[0]
);

/**
 * Searches for a modal with a specific id in the current modal stack.
 * @return {Object|undefined}
 */
export const getModalById = createSelector(
  getModalState,
  (state, modalId) => modalId,
  (modals, modalId) => modals.find(({ id }) => id === modalId)
);
