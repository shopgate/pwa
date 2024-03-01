import { createSelector } from 'reselect';

/**
 * Selects the push opt-in modal state.
 * @param {Object} state The current state of the push opt-in modal.
 * @returns {Object} whether push opt-in modal is shown.
 */
export const getPushOptInModalState = state => state?.pushOptIn?.optInModal || {};

/**
 * Selects the property of the push opt-in modal.
 * @returns {boolean} whether push opt-in modal is shown.
 */
export const getShowPushOptInModal = createSelector(
  getPushOptInModalState,
  modalState => modalState.showPushOptInModal || false
);
