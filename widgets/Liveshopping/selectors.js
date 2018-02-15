/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import { getPopulatedProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Retrieves the result hash.
 * @param {Object} state The application state.
 * @returns {string} The result hash.
 */
const getResultHash = state => generateResultHash({
  pipeline: 'getLiveshoppingProducts',
  sort: getSortOrder(state),
}, true, false);

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
 * @param {Object} props The component props.
 * @returns {Object} The product result.
 */
export const getProductsResult = createSelector(
  state => state,
  getResultHash,
  getResultByHash,
  getPopulatedProductsResult
);
