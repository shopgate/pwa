import { createSelector } from 'reselect';

/**
 * Selects the app rating information.
 * @param {Object} state The current state.
 * @returns {Object} The app rating information.
 */
export default createSelector(state => state.appRating, rating => rating);
