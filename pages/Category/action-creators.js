import { SET_CATEGORY_VIEW_MODE } from './constants';

/**
 * Creates the dispatched SET_VIEW_MODE action object.
 * @param {string} viewMode The view mode for the category view.
 * @returns {Object} The dispatched action object.
 */
export const setCategoryViewMode = viewMode => ({
  type: SET_CATEGORY_VIEW_MODE,
  viewMode,
});
