import { createSelector } from 'reselect';
import {
  getCategoryProductCount,
  getCurrentCategoryChildCount,
} from '@shopgate/engage/category';
import { getProductsResult } from '@shopgate/engage/product';

/**
 * Determines whether or not a category has any content,
 * (subcategories, child products or products received via request).
 */
export const isCategoryEmpty = createSelector(
  getCategoryProductCount,
  getCurrentCategoryChildCount,
  getProductsResult,
  (productCount, childrenCount, { products, totalProductCount }) => {
    if (childrenCount !== 0) {
      return false;
    }

    if (productCount === 0) {
      return true;
    }

    if (totalProductCount !== null && products.length === 0) {
      return true;
    }

    return false;
  }
);
