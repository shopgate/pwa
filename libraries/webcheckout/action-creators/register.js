import { WEBCHECKOUT_REGISTER_REDIRECT } from '../constants';

/**
 * Creates the dispatched WEBCHECKOUT_REGISTER_REDIRECT action object
 * @param {string} location of webcheckout register
 * @returns {Object} The dispatched action object
 */
export const registerRedirect = (location) => ({
  type: WEBCHECKOUT_REGISTER_REDIRECT,
  location,
});
