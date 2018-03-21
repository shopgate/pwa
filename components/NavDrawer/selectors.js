/**
 * Selects the menu state from the store.
 * @param {Object} state The global state.
 * @return {Object}
 */
const getMenuState = state => state.menu;

/**
 * Selects a menu by id.
 * @param {Object} state The global state.
 * @param {string} id The menu id.
 * @return {Object}
 */
export const getMenuById = (state, id) => (
  getMenuState(state).menusById[id] || {}
);
