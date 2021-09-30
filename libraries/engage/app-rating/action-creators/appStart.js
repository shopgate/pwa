import {
  RESET_APP_START_COUNT,
  INCREASE_APP_START_COUNT,
} from '../constants';

/**
 * Increment the app start count
 * @return {Object} The dispatched action object.
 */
export const increaseAppStartCount = () => ({
  type: INCREASE_APP_START_COUNT,
});

/**
 * Reset the app start count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetAppStartCount = () => ({
  type: RESET_APP_START_COUNT,
});
