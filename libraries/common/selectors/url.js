import { createSelector } from 'reselect';

/**
 * Returns url state (state.url)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getUrlState = state => state.url;

/**
 * Returns the complete state entry for state.url[type]
 * @param {string} type The url type.
 * @param {Object} state The application state.
 * @returns {Object|undefined}
 */
export const getEntryByType = createSelector(
  getUrlState,
  (state, { type }) => type,
  (urlState, type) => {
    if (!urlState || !urlState[type]) {
      return null;
    }

    return urlState[type];
  }
);

/**
 * Returns the url for the given url type.
 * @param {string} type The url type.
 * @param {Object} state The application state.
 * @returns {string|null}
 */
export const getUrl = createSelector(
  getEntryByType,
  (entry) => {
    if (!entry) {
      return null;
    }

    return entry.url;
  }
);
