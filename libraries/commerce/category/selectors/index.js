import { createSelector } from 'reselect';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';

/**
 * Retrieves the category state from the global state.
 * @param {Object} state The global state.
 * @returns {Object} The category state.
 */
const getCategoryState = state => state.category;

const getCategoriesState = createSelector(
  getCategoryState,
  state => state.categoriesById
);

/**
 * Retrieves the full category children collection from the state.
 * @param {Object} state The application state.
 * @returns {Object} The category children collection.
 */
const getChildCategoriesState = createSelector(
  getCategoryState,
  state => state.childrenByCategoryId
);

/**
 * Retrieves the root categories collection from the state.
 * @param {Object} state The application state.
 * @returns {Array} The root categories collection.
 */
const getRootCategoriesState = createSelector(
  getCategoryState,
  state => state.rootCategories
);

/**
 * Retrieves the child categories for a specific parent category from the state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The child categories state.
 */
export const getRootCategories = createSelector(
  getRootCategoriesState,
  getCategoriesState,
  (rootCategories, categoryState) => {
    if (Object.keys(rootCategories).length === 0) {
      return null;
    }

    if (!rootCategories.categories) {
      return null;
    }

    const categories = rootCategories.categories.map(id => categoryState[id]);

    return {
      ...rootCategories,
      categories,
    };
  }
);

/**
 * Retrieves the current category ID from the current route params.
 * @param {Object} state The application state.
 * @returns {string|null} The category ID.
 */
export const getCurrentCategoryId = createSelector(
  getCurrentRoute,
  (route) => {
    if (!route || !route.params || !route.params.categoryId) {
      return null;
    }

    return hex2bin(route.params.categoryId);
  }
);

/**
 * Retrieves the child categories for a specific parent category from the state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The child categories state.
 */
const getCurrentChildCategories = createSelector(
  getCurrentCategoryId,
  getChildCategoriesState,
  (categoryId, childCategories) => childCategories[categoryId]
);

/**
 * Retrieves the current category from the state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object|null} The current category.
 */
export const getCurrentCategory = createSelector(
  getCategoriesState,
  getCurrentCategoryId,
  (state, categoryId) => state[categoryId] || null
);

/**
 * Selects the number of child categories from the current category.
 * @type {number}
 */
export const getCurrentCategoryChildCount = createSelector(
  getCurrentCategory,
  category => (category ? category.childrenCount : null)
);

/**
 * Retrieves the current categories collection from the state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Array|null} The current categories collection.
 */
export const getCurrentCategories = createSelector(
  [getCurrentChildCategories, getCategoriesState],
  (childCategories, categoryState) => {
    if (!childCategories || !childCategories.children) return null;
    return childCategories.children.map(id => categoryState[id]);
  }
);

export const getCategoryProductCount = createSelector(
  getCurrentCategory,
  (category) => {
    if (!category) {
      return null;
    }

    return category.productCount;
  }
);
