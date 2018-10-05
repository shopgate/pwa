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
        },
      },
      product_2: {
        isFetching: false,
        productData: {
          id: 'product_2',
          baseProductId: 'product_1',
          name: 'Product No. 2',
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
};
