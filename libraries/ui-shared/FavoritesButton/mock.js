const mockedProduct1 = {
  productId: 'foo',
};

/**
 * Mocked state with product only. Favorites not set.
 * @type {Object}
 */
export const mockedStateNotOnList = {
  product: {
    productsById: {
      [mockedProduct1.productId]: {
        productData: mockedProduct1,
      },
    },
  },
  favorites: {
    products: {
      ids: [mockedProduct1.productId],
    },
  },
};

/**
 * Mocked state with product only. Favorites not set.
 * @type {Object}
 */
export const mockedStateOnList = {
  product: {
    productsById: {
      [mockedProduct1.productId]: {
        productData: mockedProduct1,
      },
    },
  },
  favorites: {
    products: {
      ids: [mockedProduct1.productId],
    },
  },
};

/**
 * Mocked state without data.
 * @type {{product: {, favorites: {}}}}
 */
export const mockedStateEmpty = {
  product: {
    productsById: {},
  },
  favorites: {
    products: {
      ids: [],
    },
  },
};
