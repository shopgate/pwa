import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_OPTIONS,
  RECEIVE_PRODUCT_OPTIONS,
  ERROR_PRODUCT_OPTIONS,
  EXPIRE_PRODUCTS_BY_ID,
} from '../constants';
import formatOptions from './helpers/formatOptions';

/**
 * Stores product options by the ID of the related parent product.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function optionsByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_OPTIONS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_OPTIONS: {
      const options = formatOptions(action.options);

      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          options,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    }

    case ERROR_PRODUCT_OPTIONS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
        },
      };

    case EXPIRE_PRODUCTS_BY_ID: {
      const options = { ...state };
      action.productIds.forEach((productId) => {
        if (options[productId]) {
          options[productId].expires = 0;
        }
      });

      return { ...options };
    }

    default:
      return state;
  }
}
