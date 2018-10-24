const foo = {
  productData: {
    name: 'Foo',
    availability: {
      text: 'Available',
      state: 'OK',
    },
    id: 'foo',
    baseProductId: null,
    price: {
      unitPriceStriked: 100,
      unitPrice: 101,
      currency: 'EUR',
    },
  },
};

const bar = {
  productData: {
    name: 'Bar',
    availability: {
      text: 'Available',
      state: 'OK',
    },
    id: 'bar',
    baseProductId: null,
    price: {
      unitPriceStriked: 100,
      unitPrice: 101,
      currency: 'EUR',
    },
  },
};

export const mockedEmptyState = {
  product: {
    productsById: {
      foo,
    },
  },
  favorites: {
    products: {
      ids: [],
      ready: true,
      isFetching: false,
    },
  },
};

export const mockedState = {
  ...mockedEmptyState,
  favorites: {
    products: {
      ids: ['foo'],
      ready: true,
      isFetching: false,
    },
  },
};

export const mockedNotReadyState = {
  ...mockedEmptyState,
  favorites: {
    products: {},
    isFetching: false,
  },
};

export const mockedNextProps = {
  products: [
    foo.productData,
    bar.productData,
  ],
};

