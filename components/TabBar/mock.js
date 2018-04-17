export const mockedStateDefault = {
  history: {
    pathname: '/',
    queryParams: {},
  },
  cart: {
    items: [],
  },
};

/**
 * @param {string} path The route pathname
 * @returns {Object}
 */
export const mockedStateRoute = path => ({
  ...mockedStateDefault,
  history: {
    ...mockedStateDefault.history,
    pathname: path,
  },
});
