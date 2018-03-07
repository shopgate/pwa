/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import uniq from 'lodash/uniq';
import {
  PRODUCT_LIFETIME,
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  ERROR_PRODUCTS,
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
          expires: action.cached ? (Date.now() + PRODUCT_LIFETIME) : 0,
        },
      };
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
