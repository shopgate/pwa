import { createSelector } from 'reselect';

/**
 * Selects the menu state from the store.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getMenuState = state => state.menu;

/**
 * @param {Object} state The global state.
 * @return {Object|null}
 */
export const getMenus = createSelector(
  getMenuState,
  (menuState) => {
    if (!menuState || !menuState.menuById) {
      return null;
    }

    return menuState.menuById;
  }
);

const defaultValue = {};

/**
 * Selects a menu by id.
 * @param {Object} state The global state.
 * @param {Object} props The menu props.
 * @return {Object}
 */
export const getMenuById = createSelector(
  getMenus,
  (state, { id }) => id,
  (menus, id) => {
    if (!menus || !menus[id]) {
      return defaultValue;
    }

    return menus[id];
  }
);
