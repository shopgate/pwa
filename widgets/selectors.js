/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { transformDisplayOptions } from '@shopgate/pwa-common/helpers/data';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import { getPopulatedProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Retrieves the result hash.
 * @param {Object} state The application state.
 * @param {number} type The query type.
 * @param {Object} params The query params.
 * @param {string} params.sort The sort order of the query.
 * @param {string} params.value The query parameters, depends on the query type.
 * @param {string} id A unique id for the component that is using this action.
 * @returns {string} The result hash.
 */
const getResultHash = (state, type, params, id) => {
  let hashParams = {};
  const currentSort = getSortOrder(state);
  const { value, sort = currentSort } = params;
  const transformedSort = transformDisplayOptions(sort);

  // Create the hash parameters based on the query type and parameters.
  switch (type) {
    // Product highlights
    case 1: {
      hashParams = {
        id,
        pipeline: 'getHighlightProducts',
        sort: transformedSort,
      };

      break;
    }

    // Search phrase
    case 2:
    case 3: {
      hashParams = {
        id,
        searchPhrase: value,
        sort: transformedSort,
      };

      break;
    }

    // Product ID's
    case 4: {
      hashParams = {
        id,
        productIds: value,
        sort: transformedSort,
      };

      break;
    }

    // Category
    case 5: {
      hashParams = {
        id,
        categoryId: value,
        sort: transformedSort,
      };

      break;
    }
    default:
  }

  // Generate the hash string.
  return generateResultHash(hashParams, true, false);
};

/**
 * Retrieves the result by hash.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The result.
 */
const getResultByHash = createSelector(
  state => state.product,
  getResultHash,
  (productState, hash) => productState.resultsByHash[hash]
);

/**
 * Retrieves the populated product result.
 * @param {Object} state The application state.
 * @param {Object} params The query parameters.
 * @returns {Object} The product result.
 */
export const getProductsResult = createSelector(
  state => state,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);

/**
 * Retrieves the populated product result.
 * @param {Object} state The application state.
 * @param {Object} params The query parameters.
 * @returns {Object} The product result.
 */
export const getProductsFetchingState = createSelector(
  state => state,
  getResultHash,
  getResultByHash,
  (state, hash, result) => (result ? result.isFetching : null)
);
