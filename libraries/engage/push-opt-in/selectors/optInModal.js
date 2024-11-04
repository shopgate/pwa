import { createSelector } from 'reselect';

/**
 * Selects the push opt-in modal state.
 * @param {Object} state The current state of the push opt-in modal.
 * @returns {Object} whether push opt-in modal is shown.
 */
export const getPushOptInModalState = state => state?.pushOptIn?.optInModal || {};

/**
 * Determines visibility of the Push-Opt-In Modal
 * @returns {boolean} whether push opt-in modal is shown.
 */
export const getIsPushOptInModalVisible = createSelector(
  getPushOptInModalState,
  modalState => modalState.isPushOptInModalVisible || false
);

/**
 * Determines the trigger type of the Push-Opt-In Modal
 * @returns {string} whether push opt-in modal is shown.
 */
export const getPushOptInModalTriggerType = createSelector(
  getPushOptInModalState,
  modalState => modalState.triggerType
);
