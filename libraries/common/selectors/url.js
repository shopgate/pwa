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
export const getEntryByType = (type, state) => getUrlState(state)[type];

/**
 * Returns the url for the given url type.
 * @param {string} type The url type.
 * @param {Object} state The application state.
 * @returns {string|null}
 */
export const getUrl = (type, state) => {
  const entry = getEntryByType(type, state);
  return entry ? entry.url : null;
};
