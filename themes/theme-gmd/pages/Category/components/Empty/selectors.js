import { createSelector } from 'reselect';
import {
  getCategoryProductCount,
  getCategoryChildCount,
} from '@shopgate/pwa-common-commerce/category/selectors';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Determines whether or not a category has any content,
 * (subcategories, child products or products received via request).
 */
export const isCategoryEmpty = createSelector(
  getCategoryProductCount,
  getCategoryChildCount,
  getProductsResult,
  (productCount, childrenCount, { products, totalProductCount, isFetching }) => {
    if (childrenCount !== 0) {
      return false;
    }

    if (productCount === 0) {
      return true;
    }

    if (isFetching) {
      return false;
    }

    if (totalProductCount !== null && products.length === 0) {
      return true;
    }

    return false;
  }
);
