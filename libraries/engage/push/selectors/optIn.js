/**
 * Selects the push opt in information.
 * @param {Object} state The current state.
 * @returns {Object} The push opt in information.
 */
export const getPushOptInState = state => state?.push?.optIn || {};
