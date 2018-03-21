import * as actionTypes from './constants';

/**
 * Dispatches the INCREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const incrementActionCount = () => ({
  type: actionTypes.INCREMENT_ACTION_COUNT,
});

/**
 * Dispatches the DECREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const decrementActionCount = () => ({
  type: actionTypes.DECREMENT_ACTION_COUNT,
});

/**
 * Dispatches the INCREMENT_ACTION_COUNT action.
 * @return {Object}
 */
export const resetActionCount = () => ({
  type: actionTypes.RESET_ACTION_COUNT,
});
