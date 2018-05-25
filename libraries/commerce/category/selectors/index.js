import { createSelector } from 'reselect';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '../constants';

/**
 * Retrieves the category state from the global state.
 * @param {Object} state The global state.
 * @returns {Object} The category state.
 */
const getCategoryState = state => state.category;

/**
 * Retrieves the full category children collection from the state.
 * @param {Object} state The application state.
 * @returns {Object} The category children collection.
 */
const getChildCategories = state => state.category.childrenByCategoryId;

/**
 * Retrieves the root categories collection from the state.
 * @param {Object} state The application state.
 * @returns {Array} The root categories collection.
 */
const getRootCategoriesState = state => state.category.rootCategories;

/**
 * Retrieves the router params from the props.
 * @param {Object} _ The application state. (Will be ignored!)
 * @param {Object} props The component props.
 * @returns {Object} The router params.
 */
const getParamsFromProps = (_, props = {}) => props.params;

/**
 * Retrieves widget settings from the props.
 * @param {Object} _ The application state. (Will be ignored!)
 * @param {Object} props The component props.
 * @returns {Object} The widget settings.
 */
const getSettingsFromProps = (_, props = {}) => props.settings;

/**
 * Retrieves the child categories for a specific parent category from the state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object} The child categories state.
 */
export const getRootCategories = createSelector(
  getRootCategoriesState,
  getCategoryState,
  (rootCategory, categoryState) => {
    if (Object.keys(rootCategory).length === 0) {
      return null;
    }

    if (!rootCategory.categories) {
      return null;
    }

    const categories = rootCategory.categories.map(id => categoryState.categoriesById[id]);

    return {
      ...rootCategory,
      categories,
    };
  }
);

/**
 * Retrieves the current category ID from the props.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {string|null} The category ID.
 */
export const getCurrentCategoryId = createSelector(
  getParamsFromProps,
  getSettingsFromProps,
  state => (state.category ? state.category.currentCategoryId : null),
  state => (state.history ? state.history.pathname : null),
  (params, settings, categoryId, pathname) => {
    if (params && params.categoryId) {
      return hex2bin(params.categoryId) || null;
    }

    if (settings && settings.categoryNumber) {
      return settings.categoryNumber;
    }

    if (!categoryId) {
      if (pathname && pathname.startsWith(CATEGORY_PATH)) {
        return hex2bin(pathname.split('/')[2]) || null;
      }
    }

    return categoryId;
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
  getChildCategories,
  (categoryId, childCategories) => childCategories[categoryId]
);

/**
 * Retrieves a category by ID from categoryState.
 * @param {Object} categoryState The current application categoryState.
 * @param {string} id The category ID.
 * @returns {Object} The dedicated category.
 */
const getCategoryById = (categoryState, id) => categoryState.categoriesById[id];

/**
 * Retrieves the current category from the state.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object|null} The current category.
 */
export const getCurrentCategory = createSelector(
  getCategoryState,
  getCurrentCategoryId,
  (categoryState, categoryId) => getCategoryById(categoryState, categoryId) || null
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
  getCategoryState,
  getCurrentCategoryId,
  getRootCategories,
  getCurrentChildCategories,
  (categoryState, categoryId, rootCategories, childCategories) => {
    if (!categoryId && rootCategories && rootCategories.categories) {
      return rootCategories.categories.map(id => getCategoryById(categoryState, id));
    }

    if (childCategories && childCategories.children) {
      return childCategories.children.map(id => getCategoryById(categoryState, id));
    }

    return null;
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
