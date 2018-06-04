import { createSelector } from 'reselect';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
export const getPageState = state => state.page;

/**
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Array|null}
 */
export const getPageConfigById = createSelector(
  getPageState,
  (state, props) => props.pageId,
  (pageState, pageId) => {
    if (!pageState || !pageState[pageId]) {
      return null;
    }

    return pageState[pageId];
  }
);
