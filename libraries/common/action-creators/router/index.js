import { NAVIGATE } from '../../constants/ActionTypes';

/**
 * Creates the dispatched NAVIGATE action object.
 * @param {string} action The desired history action.
 * @param {string} location The desired history location.
 * @param {Object} state The desired history state.
 * @return {Object} The dispatched action object.
 */
export const navigate = (action, location, state) => ({
  type: NAVIGATE,
  action,
  location,
  state,
});
