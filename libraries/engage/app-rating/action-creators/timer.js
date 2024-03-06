import {
  APP_RATING_SET_TIMER_START_TIME,
  APP_RATING_INCREASE_TIMER_REPEATS,
} from '../constants';

/**
 * Reset the orders placed count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetTimerState = () => ({
  type: APP_RATING_INCREASE_TIMER_REPEATS,
});

/**
 * Sets the timer start time
 * @return {Object} The dispatched action object.
 */
export const setTimerStartTime = () => ({
  type: APP_RATING_SET_TIMER_START_TIME,
});

