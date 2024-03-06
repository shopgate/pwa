import {
  PUSH_OPT_IN_INCREASE_APP_START_COUNT,
  PUSH_OPT_IN_RESET_APP_START_COUNT,
  PUSH_OPT_IN_INCREASE_ORDERS_PLACED_COUNT,
  PUSH_OPT_IN_RESET_ORDERS_PLACED_COUNT,
  PUSH_OPT_IN_INCREASE_REJECTION_COUNT,
  PUSH_OPT_IN_SET_LAST_POPUP_TIMESTAMP,
  PUSH_OPT_IN_OPT_IN_POSTPONED,
} from '../constants';

/**
 * Increment the app start count
 * @return {Object} The dispatched action object.
 */
export const increaseAppStartCount = () => ({
  type: PUSH_OPT_IN_INCREASE_APP_START_COUNT,
});

/**
 * Reset the app start count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetAppStartCount = () => ({
  type: PUSH_OPT_IN_RESET_APP_START_COUNT,
});

/**
 * Increment the orders placed count
 * @return {Object} The dispatched action object.
 */
export const increaseOrdersPlacedCount = () => ({
  type: PUSH_OPT_IN_INCREASE_ORDERS_PLACED_COUNT,
});

/**
 * Reset the orders placed count, and increment reset counts
 * @return {Object} The dispatched action object.
 */
export const resetOrdersPlacedCount = () => ({
  type: PUSH_OPT_IN_RESET_ORDERS_PLACED_COUNT,
});

/**
 * Sets the last opt-in timestamp
 * @return {Object} The dispatched action object.
 */
export const setLastPopupTimestamp = () => ({
  type: PUSH_OPT_IN_SET_LAST_POPUP_TIMESTAMP,
});

/**
 * Increased the opt-in rejection / postponement count
 * @return {Object} The dispatched action object.
 */
export const increaseRejectionCount = () => ({
  type: PUSH_OPT_IN_INCREASE_REJECTION_COUNT,
});

/**
 * Action to be dispatched when push opt in was postponed e.g. Opt In Modal was closed without
 * taking a decision about permissions.
 * @return {Object} The dispatched action object.
 */
export const optInPostponed = () => ({
  type: PUSH_OPT_IN_OPT_IN_POSTPONED,
});

