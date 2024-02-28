/**
 * Selects the push opt-in modal.
 * @param {Object} state The current state of push opt-in modal.
 * @returns {boolean} whether push opt-in modal is shown.
 */
export const getPushOptInModalState = state => state?.pushOptIn?.showPushOptInModal || false;
