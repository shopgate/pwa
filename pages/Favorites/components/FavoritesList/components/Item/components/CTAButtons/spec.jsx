/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { CREATE_MODAL } from '@shopgate/pwa-common/constants/ActionTypes';
import { ADD_PRODUCTS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import { mockedState } from 'Pages/Product/components/Header/components/CTAButtons/mock';
import { MockedAddToCartButton } from 'Components/AddToCartButton/mock';

const mockedButton = MockedAddToCartButton;
jest.mock('Components/AddToCartButton', () => mockedButton);

/**
 * Mock add to cart action
 * @return {{type}}
 */
const mockAddProductsToCart = () => ({
  type: ADD_PRODUCTS_TO_CART,
});

jest.mock('@shopgate/pwa-common-commerce/cart/actions/addProductsToCart.js', () => mockAddProductsToCart);

describe('<CTAButtons />', () => {
  let store;
  /**
   * Creates component
   * @param {Object} props The props.
   * @return {ReactWrapper}
   */
  const createComponent = (props) => {
    const mockedStore = configureStore([thunk]);
    store = mockedStore(mockedState);

    /* eslint-disable global-require */
    const CTAButtons = require('./index').default;
    /* eslint-enable global-require */
    return mount(
      <Provider store={store}>
        <CTAButtons {...props} />
      </Provider>
    );
  };

  it('should render buttons', () => {
    const component = createComponent({ productId: mockedState.favorites.products.ids[0] });
    expect(component).toMatchSnapshot();
    expect(component.find('FavoritesButton').exists()).toBe(true);
    expect(component.find('MockedAddToCartButton').exists()).toBe(true);
  });

  it('should handle show modal when add to cart is performed for a base product', () => {
    const component = createComponent({
      productId: mockedState.favorites.products.ids[0],
    });
    component.find('MockedAddToCartButton').simulate('click');
    const actions = store.getActions();
    expect(actions[0].type).toBe(CREATE_MODAL);
  });

  it('should handle add to cart', () => {
    const component = createComponent({
      productId: mockedState.favorites.products.ids[1],
    });
    component.find('MockedAddToCartButton').simulate('click');
    const actions = store.getActions();
    expect(actions[0].type).toBe(ADD_PRODUCTS_TO_CART);
  });
});
