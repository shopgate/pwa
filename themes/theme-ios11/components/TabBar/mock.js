export const mockedStateDefault = {
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
      enabled: true,
      visible: true,
    },
  },
};

/**
 * @param {boolean} [enabled=true] Tells if the tab bar is enabled for the current route.
 * @param {boolean} [visible=true] Tells if the tab bar is currently visible.
 * @returns {Object}
 */
export const getMockedState = (
  enabled = true,
  visible = true
) => ({
  ...mockedStateDefault,
  ui: {
    tabBar: {
      enabled,
      visible,
    },
  },
});
