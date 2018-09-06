import { createSelector } from 'reselect';
import { getCurrentPathname, getCurrentState } from './router';

/**
 * Retrieves the view state from the global state.
 * @param {Object} state The global state.
 * @returns {Object} The navigator state.
 */
const getViewState = state => state.view;

/**
 * Selects the currently loading views.
 * @param {Object} state The current application state.
 * @return {string}
 */
export const getLoadingViews = createSelector(
  getViewState,
  state => state.isLoading
);

/**
 * Selects whether the view for the given pathname is loading.
 * @param {Object} state The current application state.
 * @param {string} pathname The pathname of the view to check.
 * @return {boolean}
 */
export const isViewLoading = createSelector(
  getLoadingViews,
  getCurrentPathname,
  (loadingViews, currentPath) => (
    Object.keys(loadingViews).includes(currentPath) && loadingViews[currentPath] > 0
  )
);

/**
 * Selects the current route title.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getCurrentTitle = createSelector(
  getCurrentState,
  (state) => {
    if (!state || !state.title) {
      return null;
    }

    return state.title;
  }
);

/**
 * Selects whether the current view is loading.
 * @param {Object} state The current application state.
 * @return {boolean}
 */
export const isCurrentViewLoading = state => isViewLoading(state, getCurrentPathname(state));
