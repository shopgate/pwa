import * as actionTypes from './constants';

const defaultState = {
  added: 0,
};

/**
 * Stores all AddToCartBar information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.INCREMENT_ACTION_COUNT:
      return {
        added: state.added + 1,
      };
    case actionTypes.DECREMENT_ACTION_COUNT:
      return {
        added: state.added ? state.added - 1 : 0,
      };
    case actionTypes.RESET_ACTION_COUNT:
      return {
        added: 0,
      };
    default:
      return state;
  }
};

