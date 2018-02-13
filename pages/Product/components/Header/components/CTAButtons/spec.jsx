/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';

const mockedState = {
  product: {
    currentProduct: {
      productId: 'foo',
    },
    productsById: {
      foo: {
        isFetching: false,
        productData: {
          id: 'foo',
          name: 'Foo Name',
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
      ids: ['foo'],
    },
  },
};

describe('CTAs (product header)', () => {
  /**
   * Creates component
   * @return {ReactWrapper}
   */
  const createComponent = () => {
    const mockedStore = configureStore();

    /* eslint-disable global-require */
    const CTAButtons = require('./index').default;
    /* eslint-enable global-require */
    return mount(
      <Provider store={mockedStore(mockedState)}>
        <CTAButtons handleAddToCart={() => {}} />
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render CTAButtons when data is available', () => {
      const component = createComponent();
      expect(component).toMatchSnapshot();
      expect(component.find('FavoritesButton').exists()).toBe(true);
      expect(component.find('AddToCartButton').exists()).toBe(true);
    });
  });
});
