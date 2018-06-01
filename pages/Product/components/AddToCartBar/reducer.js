import {
  INCREMENT_ACTION_COUNT,
  DECREMENT_ACTION_COUNT,
  RESET_ACTION_COUNT,
  SHOW_ADD_TO_CART_BAR,
  HIDE_ADD_TO_CART_BAR,
} from './constants';

const defaultState = {
  added: 0,
  visible: true,
};

/**
 * Stores all AddToCartBar information.
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = defaultState, action) => {
  switch (action.type) {
    case INCREMENT_ACTION_COUNT:
      return {
        ...state,
        added: state.added + 1,
      };
    case DECREMENT_ACTION_COUNT:
      return {
        ...state,
        added: state.added ? state.added - 1 : 0,
      };
    case RESET_ACTION_COUNT:
      return {
        ...state,
        added: 0,
      };
    case SHOW_ADD_TO_CART_BAR:
      return {
        ...state,
        visible: true,
      };
    case HIDE_ADD_TO_CART_BAR:
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
};
