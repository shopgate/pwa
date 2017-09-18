/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const existingHash
       = '{"filters":{},"pipeline":"getProducts","productId":"9209597131","sort":"relevance"}';
export const emptyState = {
  product: {
    currentProduct: {
      product: null,
    },
  },
  reviews: {
    reviewsByHash: {},
  },
};

export const finalState = {
  product: {
    currentProduct: {
      productId: '9209597131',
    },
  },
  reviews: {
    reviewsByHash: {
      currentReviewsProductId: '9209597131',
      '{"filters":{},"pipeline":"getProducts","productId":"9209597131","sort":"relevance"}': {
        isFetching: false,
        expires: 0,
        reviews: [
          {
            author: 'John Canada',
            date: '2017-09-12T15:17:47.000Z',
            rate: 60,
            title: 'title 1',
            review: 'review 2',
            id: 1,
          },
          {
            author: 'Oleks Bilenko',
            date: '2017-09-12T15:13:03.000Z',
            rate: 80,
            title: 'Title',
            review: 'Review',
            id: 2,
          },
          {
            author: '',
            date: '2017-09-06T12:38:51.000Z',
            rate: 100,
            title: '',
            review: 'No Name and Title\r\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            id: 3,
          },
          {
            author: 'ca ship ship',
            date: '2017-09-06T12:37:40.000Z',
            rate: 40,
            title: 'Test review 2 ',
            review: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            id: 4,
          },
          {
            author: 'Carina Hoffmann',
            date: '2017-09-06T12:30:23.000Z',
            rate: 60,
            title: '',
            review: 'Test review',
            id: 5,
          },
        ],
        totalResultCount: null,
      },
    },
  },
};
