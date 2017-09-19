const mockedProduct = {
  productId: 'foo',
};

const mockedProductWithRating = {
  productId: 'foo',
  rating: {
    average: 50,
    count: 4,
  },
};

export const mockedStateWithAll = {
  product: {
    currentProduct: mockedProductWithRating,
    productsById: {
      foo: {
        productData: mockedProductWithRating,
      },
    },
    reviewsByProductId: {
      foo: {
        reviews: [
          {
            author: '',
            date: '2017-09-06T12:38:51.000Z',
            rate: 100,
            title: '',
            review: 'No Name and Title Lorem ipsum dolor sit amet, con… takimata sanctus est Lorem ipsum dolor sit amet.',
          },
          {
            author: 'username123',
            date: '2017-09-06T12:37:40.000Z',
            rate: 40,
            title: 'Test review 2 ',
            review: 'Lorem ipsum dolor sit amet, consetetur sadipscing … takimata sanctus est Lorem ipsum dolor sit amet.',
          },
          {
            author: 'Carina Hoffmann',
            date: '2017-09-06T12:30:23.000Z',
            rate: 60,
            title: '',
            review: 'Test review',
          },
          {
            author: '',
            date: '2017-09-06T12:30:23.000Z',
            rate: 20,
            title: '',
            review: '',
          },
        ],
      },
    },
  },
};

export const mockedStateWithProductOnly = {
  product: {
    currentProduct: mockedProduct,
    productsById: {
      foo: {
        productData: mockedProduct,
      },
    },
    reviewsByProductId: {},
  },
};
