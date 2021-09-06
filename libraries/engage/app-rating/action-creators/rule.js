import { SET_NEXT_RULE } from '../constants';

/**
 * Increment the app start count
 * @param {RULE_TYPES} rule next rule to be set for check
 * @return {Object} The dispatched action object.
 */
export const setNextRule = rule => ({
  type: SET_NEXT_RULE,
  rule,
});
