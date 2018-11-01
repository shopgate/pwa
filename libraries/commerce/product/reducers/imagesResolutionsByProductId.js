import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_IMAGES_RESOLUTIONS,
  RECEIVE_PRODUCT_IMAGES_RESOLUTIONS,
  ERROR_PRODUCT_IMAGES_RESOLUTIONS,
} from '../constants';

/**
 * Stores product images by product id
 * @param {Object} state Current state.
 * @param {Object} action The action object.
 * @returns {Object}
 */
export default function imagesResolutionsByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_IMAGES_RESOLUTIONS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_IMAGES_RESOLUTIONS:
      return {
        ...state,
        [action.productId]: {
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
          resolutions: action.resolutions,
        },
      };
    case ERROR_PRODUCT_IMAGES_RESOLUTIONS:
      return {
        ...state,
        [action.productId]: {
          isFetching: false,
        },
      };
    default:
      return state;
  }
}
