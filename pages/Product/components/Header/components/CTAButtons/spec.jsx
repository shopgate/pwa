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
import FavoritesButton from 'Components/FavoritesButton';
import CTAButtons from './index';
import AddToCartButton from './components/AddToCartButton';

describe('CTAs (product header)', () => {
  const mockedStore = configureStore();
  const mockedState = {
    product: {
      currentProduct: {
        productId: 'foo',
      },
      productsById: {
        foo: {
          id: 'foo',
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
  describe('Rendering', () => {
    it('should render CTAButtons when data is available', () => {
      const component = mount(
        <Provider store={mockedStore(mockedState)}>
          <CTAButtons />
        </Provider>
      );
      expect(component).toMatchSnapshot();
      expect(component.find(FavoritesButton).exists()).toBe(true);
      expect(component.find(AddToCartButton).exists()).toBe(true);
    });
  });
});

