/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

 import { createSelector } from 'reselect';
 import {
   getCategoryProductCount,
   getCurrentCategoryChildCount,
 } from '@shopgate/pwa-common-commerce/category/selectors';
 import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
 import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

 /**
  * Checks if the filter bar is shown within a category page
  * @return {bool}
  */
 export const isFilterBarShown = createSelector(
   getCurrentCategoryChildCount,
   getCategoryProductCount,
   hasActiveFilters,
   getProductsResult,
   (subCategories, categoryProductCount, activeFilters, { totalProductCount }) => {
     const hasProducts = (totalProductCount === null && categoryProductCount > 0) ||
       totalProductCount > 0;

     return !subCategories && (hasProducts || activeFilters);
   }
 );
