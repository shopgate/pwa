import * as actionTypes from './constants';

const defaultState = {
  added: 0,
  show: true,
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
        ...state,
        added: state.added + 1,
      };
    case actionTypes.DECREMENT_ACTION_COUNT:
      return {
        ...state,
        added: state.added ? state.added - 1 : 0,
      };
    case actionTypes.RESET_ACTION_COUNT:
      return {
        ...state,
        added: 0,
      };
    case actionTypes.SHOW_ADD_TO_CART_BAR:
      return {
        ...state,
        show: true,
      };
    case actionTypes.HIDE_ADD_TO_CART_BAR:
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
};
