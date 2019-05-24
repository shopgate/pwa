import configuration from '../collections/Configuration';
import { RESET_APP_REDUCERS } from '../constants/Configuration';
import { RESET_APP } from '../constants/ActionTypes';

/**
 * The root reducer.
 * @param {Function} appReducers The app reducers from combineReducers.
 * @returns {Function}
 */
const makeRootReducer = appReducers => (state, action) => {
  if (action.type === RESET_APP) {
    const resetReducers = action.reducers || configuration.get(RESET_APP_REDUCERS);
    if (Array.isArray(resetReducers)) {
      resetReducers.forEach((reducer) => {
        if (typeof state[reducer] === 'undefined') {
          return;
        }
        // Set reset reducer to undefined
        // eslint-disable-next-line no-param-reassign
        state[reducer] = undefined;
      });
    }
  }

  return appReducers(state, action);
};

export default makeRootReducer;
