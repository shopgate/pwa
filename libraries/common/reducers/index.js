import { combineReducers } from 'redux';

/**
 * Combine the reducers.
 * @param {Object} reducers The reducers.
 * @returns {Function}
 */
export default function rootReducer(reducers) {
  return combineReducers(reducers);
}
