import { createSelector } from 'reselect';
import {
  getCategoryChildren,
  getRootCategories,
} from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Creates a getCategoriesById selector
 * @returns {Function}
 */
export const makeGetSubcategoriesByCategoryId = () =>
  /**
   * Retrieves categories from the state.
   * If no category id is passed, root-categories will be returned.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object[]} The categories collection.
   */
  createSelector(
    getCategoryChildren,
    getRootCategories,
    (state, props) => props.categoryId,
    (childCategories, rootCategories, categoryId) => {
      // Check if we have to handle the root-category
      if (!categoryId && rootCategories) {
        return rootCategories;
      }

      return childCategories;
    }
  );

