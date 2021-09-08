import { INCREASE_REJECTION_COUNT, SET_LAST_POPUP_TIMESTAMP } from '../constants';

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

