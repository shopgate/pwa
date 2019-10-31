import { createSelector } from 'reselect';
import { getCurrentRoute, getCurrentParams } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';

/**
 * Retrieves the category state from the state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The category state.
 */
const getCategoryState = state => state.category;

/**
 * Retrieves the categoriesById state from the category state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The categoriesById state.
 */
const getCategoriesByIdState = createSelector(
  getCategoryState,
  (state = {}) => state.categoriesById || {}
);

/**
 * Retrieves the childrenByCategoryId state from the category state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The childrenByCategoryId state.
 */
const getChildrenByCategoryIdState = createSelector(
  getCategoryState,
  (state = {}) => state.childrenByCategoryId || {}
);

/**
 * Retrieves the rootCategories state from the category state.
 * @param {Object} state The application state.
 * @returns {Object}
 */
const getRootCategoriesState = createSelector(
  getCategoryState,
  (state = {}) => state.rootCategories || {}
);

/**
 * Retrieves a category id either from the selector props, or the params of the active route.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {string|null} The category ID.
 */
export const getCategoryId = createSelector(
  (state, props = {}) => props.categoryId,
  getCurrentParams,
  (categoryId, routeParams) => {
    if (typeof categoryId !== 'undefined') {
      return categoryId;
    }

    if (!routeParams || !routeParams.categoryId) {
      return null;
    }

    return hex2bin(routeParams.categoryId);
  }
);

/**
 * Retrieves the child categories for a specific parent category from the state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const getChildCategoriesForCategory = createSelector(
  getCategoryId,
  getChildrenByCategoryIdState,
  (categoryId, childCategories) => childCategories[categoryId]
);

/**
 * Retrieves a category from state.
 * The category can either be referenced by a categoryId within the props,
 * or by a categoryId within the params of the active route state.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object|null}
 */
export const getCategory = createSelector(
  getCategoryId,
  getCategoriesByIdState,
  (categoryId, categoriesById) => {
    if (!categoriesById || !categoriesById[categoryId]) {
      return null;
    }

    return categoriesById[categoryId];
  }
);

/**
 * Retrieves the root categories.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Array}
 */
export const getRootCategories = createSelector(
  getRootCategoriesState,
  getCategoriesByIdState,
  (rootCategories, categoriesById) => {
    if (Object.keys(rootCategories).length === 0) {
      return null;
    }

    if (!rootCategories.categories) {
      return null;
    }

    return rootCategories.categories.map(id => categoriesById[id]).filter(Boolean);
  }
);

/**
 * Retrieves the number of child categories for a category.
 * The category can either be referenced by a categoryId within the props,
 * or by a categoryId within the params of the active route state.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @returns {number|null}
 */
export const getCategoryChildCount = createSelector(
  getCategory,
  category => (category ? category.childrenCount : null)
);

/**
 * Determines if a category has child categories.
 * The category can either be referenced by a categoryId within the props,
 * or by a categoryId within the params of the active route state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {boolean}
 */
export const hasCategoryChildren = createSelector(
  getCategoryChildCount,
  count => count > 0
);

/**
 * Retrieves the child categories of a category.
 * The category can either be referenced by a categoryId within the props,
 * or by a categoryId within the params of the active route state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Array|null}
 */
export const getCategoryChildren = createSelector(
  [getChildCategoriesForCategory, getCategoriesByIdState],
  (childCategories, categoriesById) => {
    if (!childCategories || !childCategories.children) {
      return null;
    }

    return childCategories.children.map(id => categoriesById[id]).filter(Boolean);
  }
);

/**
 * Retrieves the number of products inside a category.
 * The category can either be referenced by a categoryId within the props,
 * or by a categoryId within the params of the active route state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {number|null}
 */
export const getCategoryProductCount = createSelector(
  getCategoriesByIdState,
  getCategoryId,
  (categoriesById, categoryId) => {
    if (
      !categoriesById[categoryId]
      || (!categoriesById[categoryId].productCount && categoriesById[categoryId].productCount !== 0)
    ) {
      return null;
    }

    return categoriesById[categoryId].productCount;
  }
);

/**
 * Determines if a category has products.
 * The category can either be referenced by a categoryId within the props,
 * or by a categoryId within the params of the active route state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {boolean}
 */
export const hasCategoryProducts = createSelector(
  getCategoryProductCount,
  count => count > 0
);

/**
 * Retrieves the name of a category. When no category can be determined it return the title of
 * the active route.
 * The category can either be referenced by a categoryId within the props,
 * or by a categoryId within the params of the active route state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {number|null}
 */
export const getCategoryName = createSelector(
  getCurrentRoute,
  getCategory,
  (route, category) => {
    if (category) {
      return category.name;
    }

    if (route.state.title) {
      return route.state.title;
    }

    return null;
  }
);

/**
 * Selector mappings for PWA < 6.10
 * @deprecated
 */
export const getCategoryById = getCategory;
export const getCurrentCategoryId = getCategory;
export const getCurrentCategory = getCategory;
export const getCurrentCategoryChildCount = getCategoryChildCount;
export const getCurrentCategories = getCategoryChildren;
export const getChildCategoriesById = getCategoryChildren;

export const hasChildren = hasCategoryChildren;
export const hasProducts = hasCategoryProducts;
