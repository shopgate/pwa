import {
  INCREASE_REJECTION_COUNT,
  SET_ALREADY_RATED,
  SET_LAST_POPUP_TIMESTAMP,
} from '../constants';

/**
 * Sets the last popup timestamp
 * @return {Object} The dispatched action object.
 */
export const setLastPopupTimestamp = () => ({
  type: SET_LAST_POPUP_TIMESTAMP,
});

/**
 * Sets the last popup timestamp
 * @return {Object} The dispatched action object.
 */
export const increaseRejectionCount = () => ({
  type: INCREASE_REJECTION_COUNT,
});

/**
 * Sets the last popup timestamp
 * @param {boolean} to the value to set the rated status
 * @return {Object} The dispatched action object.
 */
export const setAlreadyRated = to => ({
  type: SET_ALREADY_RATED,
  to,
});

