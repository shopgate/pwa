/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Checks if the filter bar is shown within a search page
 * @return {bool}
 */
export const isFilterBarShown = createSelector(
  hasActiveFilters,
  getProductsResult,
  (activeFilters, { totalProductCount }) =>
    totalProductCount === null || (totalProductCount > 0 || activeFilters)
);
