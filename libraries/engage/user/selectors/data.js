import { getUserData } from '@shopgate/pwa-common/selectors/user';

/**
 * Selects the id of the currently logged in user or null if not logged in.
 * @param {Object} state The application state.
 *@returns {[number]}
 */
export const getUserId = state => getUserData(state).id || null;
