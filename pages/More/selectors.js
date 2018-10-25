import { createSelector } from 'reselect';

/**
 * Selects the menu state from the store.
 * @param {Object} state The global state.
 * @return {Object}
 */
const getMenuState = state => state.menu.menusById;

/**
 * @returns {Function}
 */
export const makeGetMenuById = () => (
  createSelector(
    getMenuState,
    (state, props) => props.id,
    (menus, id) => {
      if (!id || !menus[id] || !menus[id].entries) {
        return null;
      }

      return menus[id].entries;
    }
  )
);
