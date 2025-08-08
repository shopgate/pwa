import { ENOTFOUND } from '@shopgate/pwa-core/constants/Pipeline';
import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCT,
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCTS,
  ERROR_PRODUCT,
  UPDATE_METADATA,
  EXPIRE_PRODUCT_BY_ID,
  DELETE_PRODUCTS_BY_IDS,
  RECEIVE_PRODUCT_RELATIONS,
  EXPIRE_PRODUCT_DATA,
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

    // Mark all product data as expired
    case EXPIRE_PRODUCT_DATA: {
      return Object.keys(state).reduce((accumulator, productId) => {
        accumulator[productId] = {
          ...accumulator[productId],
          expires: 0,
        };
        return accumulator;
      }, { ...state });
    }

    case DELETE_PRODUCTS_BY_IDS: {
      const nextState = { ...state };

      if (Array.isArray(action?.productIds) && action.scopes.includes('price')) {
        action.productIds.forEach((productId) => {
          delete nextState[productId];
        });
      }

      return nextState;
    }
    default:
      return state;
  }
}
