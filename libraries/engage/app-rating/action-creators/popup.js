import {
  APP_RATING_INCREASE_REJECTION_COUNT,
  APP_RATING_SET_ALREADY_RATED,
  APP_RATING_SET_LAST_POPUP_TIMESTAMP,
} from '../constants';

/**
 * Sets the last popup timestamp
 * @return {Object} The dispatched action object.
 */
export const setLastPopupTimestamp = () => ({
  type: APP_RATING_SET_LAST_POPUP_TIMESTAMP,
});

/**
 * Sets the last popup timestamp
 * @return {Object} The dispatched action object.
 */
export const increaseRejectionCount = () => ({
  type: APP_RATING_INCREASE_REJECTION_COUNT,
});

/**
 * Sets the last popup timestamp
 * @param {boolean} to the value to set the rated status
 * @return {Object} The dispatched action object.
 */
export const setAlreadyRated = to => ({
  type: APP_RATING_SET_ALREADY_RATED,
  to,
});

