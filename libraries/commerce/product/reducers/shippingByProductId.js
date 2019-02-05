import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_SHIPPING,
  RECEIVE_PRODUCT_SHIPPING,
  ERROR_PRODUCT_SHIPPING,
} from '../constants';

/**
 * Stores product shipping by it's product ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function shippingByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_SHIPPING:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_SHIPPING:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          shipping: action.shipping,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    case ERROR_PRODUCT_SHIPPING:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
        },
      };

    default:
      return state;
  }
}
