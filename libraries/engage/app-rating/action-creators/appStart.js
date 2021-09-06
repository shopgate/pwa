import {
  RESET_APP_START_COUNT,
  INCREMENT_APP_START_COUNT,
  RESET_APP_START_STATE,
} from '../constants';

/**
 * Increment the app start count
 * @return {Object} The dispatched action object.
 */
export const incrementAppStartCount = () => ({
  type: INCREMENT_APP_START_COUNT,
});

/**
 * Reset the app start count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetAppStartCount = () => ({
  type: RESET_APP_START_COUNT,
});

/**
 * Reset app start state
 * @return {Object} The dispatched action object.
 */
export const resetAppStartState = () => ({
  type: RESET_APP_START_STATE,
});
