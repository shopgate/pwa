import { produce } from 'immer';
import { SET_STORE_FINDER_SEARCH_RADIUS } from '../constants';

export const defaultState = {
  radius: null,
};

/**
 * Stores store finder related data
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
const storeFinderSearch = (state = defaultState, action) => {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case SET_STORE_FINDER_SEARCH_RADIUS: {
        draft.radius = action.radius;
        break;
      }

      default:
        break;
    }

    return undefined;
  });

  /* eslint-enable no-param-reassign */
  return producer(state);
};

export default storeFinderSearch;
