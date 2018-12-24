import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_VARIANTS,
  RECEIVE_PRODUCT_VARIANTS,
  ERROR_PRODUCT_VARIANTS,
  EXPIRE_PRODUCTS_BY_ID,
} from '../constants';

/**
 * Stores product variants by the ID of the related parent product.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function variantsByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_VARIANTS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_VARIANTS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          variants: action.variants,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    case ERROR_PRODUCT_VARIANTS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
        },
      };

    case EXPIRE_PRODUCTS_BY_ID: {
      const variants = { ...state };
      action.productIds.forEach((productId) => {
        if (variants[productId]) {
          variants[productId].expires = 0;
        }
      });

      return { ...variants };
    }

    default:
      return state;
  }
}
