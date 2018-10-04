import { createSelector } from 'reselect';
import { isNumber } from '@shopgate/pwa-common/helpers/validation';
import {
  getCategoryProductCount,
  getCurrentCategoryChildCount,
} from '@shopgate/pwa-common-commerce/category/selectors';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Determines whether or not a category has any content,
 * (subcategories, child products or products received via request).
 */
export const isCategoryEmpty = createSelector(
  getCategoryProductCount,
  getCurrentCategoryChildCount,
  getProductsResult,
  (categoryProductCount, categoryChildrenCount, { products, totalProductCount }) => {
    /**
     * Check if we have any products and if we have a valid number
     * for the total number of products. Not having a valid number
     * indicates that a request is ongoing.
     */
    const hasProductResult = products.length === 0 && isNumber(totalProductCount);

    /**
     * Check if we have any subcategories, child products or a product result for this category.
     */
    if (categoryChildrenCount === 0 && (categoryProductCount === 0 || hasProductResult)) {
      return true;
    }

    return false;
  }
);
