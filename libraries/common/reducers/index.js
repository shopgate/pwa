import { combineReducers } from 'redux';

/**
 * Combine the reducers.
 * @param {Object} reducers The reducers.
 * @returns {Function}
 */
const rootReducer = reducers => combineReducers(reducers);

export default rootReducer;
