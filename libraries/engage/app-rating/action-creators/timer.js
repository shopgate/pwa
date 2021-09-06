import {
  RESET_TIMER_COUNT,
  INCREMENT_TIMER_COUNT,
  RESET_TIMER_STATE,
} from '../constants';

/**
 * Increment the orders placed count
 * @return {Object} The dispatched action object.
 */
export const incrementTimerCount = () => ({
  type: INCREMENT_TIMER_COUNT,
});

/**
 * Reset the orders placed count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetTimerCount = () => ({
  type: RESET_TIMER_COUNT,
});

/**
 * Reset orders placed state
 * @return {Object} The dispatched action object.
 */
export const resetTimerState = () => ({
  type: RESET_TIMER_STATE,
});
