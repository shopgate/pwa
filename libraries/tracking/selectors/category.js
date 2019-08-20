import { createSelector } from 'reselect';
import {
  hex2bin,
  makeGetRouteParam,
  makeGetRoutePattern,
} from '@shopgate/engage/core';
import {
  CATEGORY_PATTERN,
  ROOT_CATEGORY_PATTERN,
  getRootCategories,
  getCategoryById,
} from '@shopgate/engage/category';
import {
  createCategoryData,
  createRootCategoryData,
} from '../helpers';

/**
 * Creates a selector that retrieves a formatted category for the current route.
 * @returns {Function}
 */
export const makeGetRouteCategory = () => {
  const getRoutePattern = makeGetRoutePattern();
  const getCategoryIdRouteParam = makeGetRouteParam('categoryId');

  return createSelector(
    state => state,
    getRoutePattern,
    getCategoryIdRouteParam,
    getRootCategories,
    (state, pattern, categoryId, rootCategories) => {
      const decodedCategoryId = categoryId ? hex2bin(categoryId) : null;

      if (pattern === ROOT_CATEGORY_PATTERN) {
        return createRootCategoryData(rootCategories);
      } else if (pattern === CATEGORY_PATTERN && decodedCategoryId) {
        return createCategoryData(getCategoryById(state, { categoryId: decodedCategoryId }));
      }

      return null;
    }
  );
};
