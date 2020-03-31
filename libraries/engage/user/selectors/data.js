import { getUserData } from '@shopgate/pwa-common/selectors/user';

/**
 * Selects the id of the currently logged in user or null if not logged in.
 * @param {Object} state The application state.
 * @returns {[number]}
 */
export const getUserId = state => getUserData(state).id || null;

/**
 * Selects the external customer number (ecp identifier)
 * of the currently logged in user or null if not logged in.
 * @param {Object} state The application state.
 * @returns {[number]}
 */
export const getExternalCustomerNumber = state => getUserData(state).externalCustomerNumber || null;
