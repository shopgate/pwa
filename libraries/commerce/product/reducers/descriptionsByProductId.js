import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_DESCRIPTION,
  RECEIVE_PRODUCT_DESCRIPTION,
  ERROR_PRODUCT_DESCRIPTION,
} from '../constants';

/**
 * Stores product descriptions by their product ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function descriptionsByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_DESCRIPTION:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_DESCRIPTION:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          description: action.description,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    case ERROR_PRODUCT_DESCRIPTION:
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
