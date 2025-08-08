import { createSelector } from 'reselect';
import {
  getCategoryChildren,
  getRootCategories,
} from '@shopgate/engage/category/selectors';
/**
 * Retrieves categories from the state.
 * If no category id is passed, root-categories will be returned.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object[]} The categories collection.
 */
export const getCategoriesById = createSelector(
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
