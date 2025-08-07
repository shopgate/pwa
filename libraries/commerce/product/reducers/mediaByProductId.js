import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT_MEDIA,
  RECEIVE_PRODUCT_MEDIA,
  ERROR_PRODUCT_MEDIA,
  EXPIRE_PRODUCT_DATA,
} from '../constants';

/**
 * Stores product media by the ID of the related parent product.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function mediaByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_MEDIA:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT_MEDIA: {
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          media: action.media,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    }

    case ERROR_PRODUCT_MEDIA:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
        },
      };

      // Mark all product media as expired when action is dispatched with the "media" scope
    case EXPIRE_PRODUCT_DATA: {
      if (Array.isArray(action.scopes) && action.scopes.includes('media')) {
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
