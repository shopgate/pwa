/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
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

const mockedStateWithoutProducts = {
  favorites: {
    products: {
      isFetching: false,
      expires: 0,
      ids: [],
    },
  },
};

const mockedStateWithProducts = {
  favorites: {
    products: {
      isFetching: false,
      expires: 0,
      ids: [mockedList.products[0].id],
    },
  },
};

/**
 * Gets mocked state.
 * @param {boolean} withProducts When true products are returned.
 * @param {boolean} validCache When true, `.expires` flag is > `Date.now()`
 * @returns {Object}
 */
const getMockedState = ({ withProducts, validCache = false }) => {
  const data = withProducts ? mockedStateWithProducts : mockedStateWithoutProducts;
  if (validCache) {
    data.favorites.products.expires = Date.now() + 999999;
  }

  return data;
};

/**
 * Gets mocked state.
 * @param {'then'|string} variant Variant as in MockedPipelineResponse.
 * @param {boolean} withProducts When true products are returned.
 * @param {boolean} validCache When true, `.expires` flag is > `Date.now()`
 * @returns {function}
 */
const mockedGetState = (variant, { withProducts = false, validCache = false } = {}) => () => {
  if (variant === 'then') {
    return getMockedState({
      withProducts,
      validCache,
    });
  }
  return getMockedState({ withProducts: false });
};

export {
  mockedList,
  mockedGetState,
};
