import { getUserData } from '@shopgate/pwa-common/selectors/user';

/**
 * Selects the id of the currently logged in user or null if not logged in.
 * @param {Object} state The application state.
 * @returns {[number]}
 */
export const getUserId = (state) => {
  const userData = getUserData(state) || {};
  return userData.id || null;
};

/**
 * Selects the external customer number (ecp identifier)
 * of the currently logged in user or null if not logged in.
 * @param {Object} state The application state.
 * @returns {[number]}
 */
export const getExternalCustomerNumber = (state) => {
  const userData = getUserData(state) || {};
  return userData.externalCustomerNumber || null;
};
