import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_IMAGES,
  RECEIVE_PRODUCT_IMAGES,
  ERROR_PRODUCT_IMAGES,
  EXPIRE_PRODUCTS_BY_ID,
} from '../constants';

/**
 * Stores product images by product id
 * @param {Object} state Current state.
 * @param {Object} action The action object.
 * @returns {Object}
 */
export default function imagesByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_IMAGES:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_IMAGES:
      return {
        ...state,
        [action.productId]: {
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
          images: action.productImages,
        },
      };
    case ERROR_PRODUCT_IMAGES:
      return {
        ...state,
        [action.productId]: {
          isFetching: false,
        },
      };

    case EXPIRE_PRODUCTS_BY_ID: {
      const images = { ...state };
      action.productIds.forEach((productId) => {
        if (images[productId]) {
          images[productId].expires = 0;
        }
      });

      return { ...images };
    }

    default:
      return state;
  }
}
