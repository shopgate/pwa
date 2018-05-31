import { TAB_BAR_TOGGLE_HANDLER_THEME } from './constants';

export const mockedStateDefault = {
  history: {
    pathname: '/',
    queryParams: {},
  },
  cart: {
    items: [],
  },
  favorites: {
    products: {
      ids: [1, 2],
    },
  },
  ui: {
    tabBar: {
      shownByExtension: true,
      toggleHandler: TAB_BAR_TOGGLE_HANDLER_THEME,
    },
  },
};

/**
 * @param {string} path The route pathname
 * @param {boolean} shownByExtension Tells if the TabBar is shown by an extension.
 * @param {string} toggleHandler The TabBar toggle handler.
 * @returns {Object}
 */
export const mockedStateRoute = (
  path,
  shownByExtension = true,
  toggleHandler = TAB_BAR_TOGGLE_HANDLER_THEME
) => ({
  ...mockedStateDefault,
  ui: {
    tabBar: {
      shownByExtension,
      toggleHandler,
    },
  },
  history: {
    ...mockedStateDefault.history,
    pathname: path,
  },
});
