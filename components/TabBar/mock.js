export const mockedStateDefault = {
  history: {
    pathname: '/',
    queryParams: {},
  },
  cart: {
    items: [],
  },
};

export const mockedStateRoute = (path) => ({
  ...mockedStateDefault,
  ...{
    history: {
      ...mockedStateDefault.history,
      ...{
        pathname: path,
      },
    },
  },
});