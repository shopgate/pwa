export const mockedStoreWithShippingPrice = {
  product: {
    shippingByProductId: {
      fakeId: {
        shipping: {
          price: 1,
          currency: 'EUR',
        },
      },
    },
  },
};
export const mockedStoreWithFreeShipping = {
  product: {
    ...mockedStoreWithShippingPrice.product,
    shippingByProductId: {
      fakeId: {
        shipping: {
          price: 0,
          currency: 'EUR',
        },
      },
    },
  },
};

export const mockedStoreWithUnknownShipping = {
  product: {
    ...mockedStoreWithShippingPrice.product,
    shippingByProductId: {
      fakeId: {
        shipping: {
          price: null,
          currency: 'EUR',
        },
      },
    },
  },
};
