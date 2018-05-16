import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { ADD_PRODUCTS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import { MockedAddToCartButton } from '@shopgate/pwa-ui-shared/AddToCartButton/mock';
import {
  mockedState,
  mockedVariantState,
} from './mock';

const mockedButton = MockedAddToCartButton;
jest.mock('@shopgate/pwa-ui-shared/AddToCartButton', () => mockedButton);

/**
 * Mock add to cart action
 * @return {{type}}
 */
const mockAddProductsToCart = () => ({
  type: ADD_PRODUCTS_TO_CART,
});

jest.mock('@shopgate/pwa-common-commerce/cart/actions/addProductsToCart.js', () => mockAddProductsToCart);

describe('CTAs (product header)', () => {
  let store;
  /**
   * Creates component
   * @param {Object} state Mocked state
   * @return {ReactWrapper}
   */
  const createComponent = (state) => {
    const mockedStore = configureStore([thunk]);
    store = mockedStore(state);

    /* eslint-disable global-require */
    const CTAButtons = require('./index').default;
    /* eslint-enable global-require */
    return mount(<Provider store={store}><CTAButtons /></Provider>);
  };

  describe('Rendering', () => {
    it('should render CTAButtons when data is available', () => {
      const component = createComponent(mockedState);
      expect(component).toMatchSnapshot();
      expect(component.find('FavoritesButton').exists()).toBe(true);
      expect(component.find('MockedAddToCartButton').exists()).toBe(true);
    });

    it('should handle add to cart', () => {
      const component = createComponent(mockedVariantState);
      component.find('MockedAddToCartButton').simulate('click');
      const actions = store.getActions();
      expect(actions[0].type).toBe(ADD_PRODUCTS_TO_CART);
    });
  });
});
