import { ENOTFOUND } from '@shopgate/pwa-core/constants/Pipeline';
import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT,
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCTS,
  ERROR_PRODUCT,
  UPDATE_METADATA,
  EXPIRE_PRODUCT_BY_ID,
  RECEIVE_PRODUCT_RELATIONS,
} from '../constants';
import handleProductCollection from './helpers/handleProductCollection';

/**
 * Stores products by their ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function productsById(state = {}, action) {
  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return {
        ...state,
        ...handleProductCollection(action.products),
      };
    case RECEIVE_PRODUCT_RELATIONS:
      return {
        ...state,
        ...handleProductCollection(action.payload.relations),
      };
    case REQUEST_PRODUCT:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCT:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          productData: action.productData,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
        },
      };
    case ERROR_PRODUCT:
      if (action.errorCode === ENOTFOUND) {
        // Remove the entry from the state when noting was found for the productId.
        const { [action.productId]: ignore, ...rest } = state;
        return rest;
      }

      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
        },
      };
    case UPDATE_METADATA: {
      const { productData = {} } = state[action.productId];

      // Merge the given metadata with the existing metadata.
      const metadata = {
        ...productData.metadata,
        ...action.metadata,
      };

      // Put the metadata back into the productData.
      const updatedProductData = {
        ...productData,
        metadata,
      };

      // Put the updated product back into the state.
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          productData: updatedProductData,
        },
      };
    }

    case EXPIRE_PRODUCT_BY_ID:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          expires: 0,
        },
      };

    default:
      return state;
  }
}
