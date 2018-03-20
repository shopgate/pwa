import { SET_FILTER_HASH } from '../constants';

/**
 * Stores a collection of available filters by the related hash of the request parameters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function hash(state = null, action) {
  switch (action.type) {
    case SET_FILTER_HASH:
      return action.hash;
    default:
      return state;
  }
}
