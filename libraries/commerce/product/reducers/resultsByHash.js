import uniq from 'lodash/uniq';
import { ENOTFOUND } from '@shopgate/pwa-core';
import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  ERROR_PRODUCTS,
  EXPIRE_PRODUCT_BY_ID,
  ERROR_PRODUCT,
} from '../constants';

/**
 * Stores a collection of products by the related hash of the request parameters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function resultsByHash(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCTS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_PRODUCTS: {
      if (!action.hash) {
        return state;
      }
      const { products } = state[action.hash];
      const nextProducts = action.products || [];

      /**
       * If there are no previous products and no incoming products
       * its set to empty array, otherwise it will be an array of the previous and the
       * new products. Duplicates are removed.
       */
      const stateProducts = (products || nextProducts.length) ? uniq([
        ...(products || []),
        ...nextProducts.map(product => product.id),
      ]) : [];

      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          products: stateProducts,
          totalResultCount: typeof action.totalResultCount !== 'undefined' ? action.totalResultCount : null,
          isFetching: false,
          expires: action.cached ? (Date.now() + action.cachedTime || PRODUCT_LIFETIME) : 0,
        },
      };
    }

    /* Remove not found product from hash results */
    case ERROR_PRODUCT:
      if (action.errorCode === ENOTFOUND) {
        return Object.keys(state).reduce((accumulator, hash) => {
          if (accumulator[hash].products
            && accumulator[hash].products.includes(action.productId)
          ) {
            accumulator[hash] = {
              ...accumulator[hash],
              products: accumulator[hash].products.filter((
                pId => pId !== action.productId
              )),
            };
          }
          return accumulator;
        }, { ...state });
      }
      return state;

    case EXPIRE_PRODUCT_BY_ID: {
      const productIds = [].concat(action.productId);

      return Object.keys(state).reduce((accumulator, hash) => {
        if (accumulator[hash].products
          && productIds.some(id => accumulator[hash].products.includes(id))) {
          accumulator[hash] = {
            ...accumulator[hash],
            expires: 0,
            ...action.complete && {
              products: accumulator[hash].products
                .filter(id => !productIds.includes(id)),
            },
          };
        }
        return accumulator;
      }, { ...state });
    }

    case ERROR_PRODUCTS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: false,
        },
      };
    default:
      return state;
  }
}
