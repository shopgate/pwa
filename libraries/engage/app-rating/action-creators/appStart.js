import {
  APP_RATING_RESET_APP_START_COUNT,
  APP_RATING_INCREASE_APP_START_COUNT,
} from '../constants';

/**
 * Increment the app start count
 * @return {Object} The dispatched action object.
 */
export const increaseAppStartCount = () => ({
  type: APP_RATING_INCREASE_APP_START_COUNT,
});

/**
 * Reset the app start count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetAppStartCount = () => ({
  type: APP_RATING_RESET_APP_START_COUNT,
});
