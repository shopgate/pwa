export const mockedProduct1 = {
  productId: '1234',
};

/**
 * Mocked state with product only. Favorites not set.
 * @type {Object}
 */
export const mockedStateWithDiscount = {
  product: {
    productsById: {
      [mockedProduct1.productId]: {
        productData: {
          price: {
            discount: 12,
          },
        },
      },
    },
  },
};

/**
 * Mocked state with product only. Favorites not set.
 * @type {Object}
 */
export const mockedStateWithoutDiscount = {
  product: {
    productsById: {
      [mockedProduct1.productId]: {
        productData: {
          price: {
            discount: 0,
          },
        },
      },
    },
  },
};
