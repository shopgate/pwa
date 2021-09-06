import {
  SET_TIMER_START_TIME,
  INCREASE_TIMER_REPEATS,
} from '../constants';

/**
 * Reset the orders placed count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetTimerState = () => ({
  type: INCREASE_TIMER_REPEATS,
});

/**
 * Sets the timer start time
 * @return {Object} The dispatched action object.
 */
export const setTimerStartTime = () => ({
  type: SET_TIMER_START_TIME,
});

