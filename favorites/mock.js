/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mockedList = {
  products: [
    {
      id: 'SG117',
      name: 'no_description',
      active: true,
      description: '',
      customData: null,
      manufacturer: '',
      identifiers: {
        sku: 'pub_SG117',
      },
      tags: [],
      ageRating: 0,
      stock: {
        ignoreQuantity: true,
        quantity: 0,
        info: '',
        orderable: true,
        minOrderQuantity: 0,
        maxOrderQuantity: 0,
      },
      rating: {
        count: 0,
        average: 0,
        reviewCount: 0,
      },
      flags: {
        hasChildren: false,
        hasVariants: false,
        hasOptions: false,
      },
      internalLog: 'd41d8cd98f00b204e9800998ecf8427e',
      availability: {
        text: 'Verfügbar',
        state: 'ok',
      },
      featuredImageUrl: null,
      type: 'simple',
      price: null,
    },
  ],
};

/**
 * Returns mocked pipeline request which resolve immediately with a non-empty list.
 * @returns {Promise}
 */
function MockedPipelineRequest() {
  this.dispatch = () => new Promise(resolve => resolve(mockedList));

  return this;
}

export {
  mockedList,
  MockedPipelineRequest,
};
