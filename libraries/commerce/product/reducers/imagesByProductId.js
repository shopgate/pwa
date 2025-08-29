import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_IMAGES,
  RECEIVE_PRODUCT_IMAGES,
  ERROR_PRODUCT_IMAGES,
  EXPIRE_PRODUCT_DATA,
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
    // Mark all product images as expired when action is dispatched with the "media" scope
    case EXPIRE_PRODUCT_DATA: {
      if (Array.isArray(action.scopes) && action.scopes.includes('media')) {
        // Expire all descriptions
        return Object.keys(state).reduce((acc, productId) => {
          acc[productId] = {
            ...state[productId],
            expires: 0,
          };
          return acc;
        }, {});
      }
      return state;
    }

    default:
      return state;
  }
}
