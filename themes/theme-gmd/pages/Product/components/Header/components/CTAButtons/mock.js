export const mockedState = {
  product: {
    currentProduct: {
      productId: 'product_1',
    },
    productsById: {
      product_1: {
        isFetching: false,
        productData: {
          id: 'product_1',
          name: 'Product No. 1',
          flags: {
            hasVariants: true,
            hasOptions: false,
          },
        },
      },
      product_2: {
        isFetching: false,
        productData: {
          id: 'product_2',
          baseProductId: 'product_1',
          name: 'Product No. 2',
          flags: {
            hasVariants: false,
            hasOptions: false,
          },
        },
      },
    },
  },
  favorites: {
    products: {
      isFetching: false,
      ids: ['product_1', 'product_2'],
    },
  },
  cart: {
    productPendingCount: 0,
  },
};

export const mockedVariantState = {
  product: {
    currentProduct: {
      productId: 'product_1',
      productVariantId: 'product_2',
    },
    productsById: {
      product_1: {
        isFetching: false,
        productData: {
          id: 'product_1',
          name: 'Product No. 1',
          flags: {
            hasVariants: true,
            hasOptions: false,
          },
        },
      },
      product_2: {
        isFetching: false,
        productData: {
          id: 'product_2',
          baseProductId: 'product_1',
          name: 'Product No. 2',
          flags: {
            hasVariants: false,
            hasOptions: false,
          },
        },
      },
    },
    optionsByProductId: {
      product_1: null,
      product_2: null,
    },
  },
  favorites: {
    products: {
      isFetching: false,
      ids: ['product_1', 'product_2'],
    },
  },
  cart: {
    productPendingCount: 0,
  },
};
