import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { UPDATE_HISTORY } from '@shopgate/pwa-common/constants/ActionTypes';
import { ADD_PRODUCTS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import {
  mockedStateVisible,
  mockedStateHidden,
  mockedStateSimpleProduct,
  mockedStateSimpleProductNotReady,
  mockedStateVariants,
  mockedStateVariantsReady,
  mockedStateVariantsNotOrderable,
} from './mock';

/**
 * History update mock
 * @param {Object} historyProps The next path
 * @return {{type, historyProps: *}}
 */
const mockHistoryUpdate = historyProps => ({
  type: UPDATE_HISTORY,
  historyProps,
});

jest.mock('@shopgate/pwa-common/actions/history/pushHistory.js', () => mockHistoryUpdate);

/**
 * Mock add to cart action
 * @return {{type}}
 */
const mockAddProductsToCart = () => ({
  type: ADD_PRODUCTS_TO_CART,
});

jest.mock('@shopgate/pwa-common-commerce/cart/actions/addProductsToCart.js', () => mockAddProductsToCart);

describe('<AddToCartBar>', () => {
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
    const AddToCartBar = require('./index').default;
    /* eslint-enable global-require */
    return mount(<Provider store={store}><AddToCartBar /></Provider>);
  };

  describe('Visiblity', () => {
    it('should be visible', () => {
      const component = createComponent(mockedStateVisible);
      expect(component).toMatchSnapshot();
      expect(component.find('AddToCartBar').children()).toHaveLength(2);
    });

    it('should be hidden', () => {
      const component = createComponent(mockedStateHidden);
      expect(component).toMatchSnapshot();
      expect(component.find('AddToCartBar').children()).toHaveLength(0);
    });
  });

  describe('Variants', () => {
    it('should render car when data is available', () => {
      const component = createComponent(mockedStateVariants);
      expect(component).toMatchSnapshot();
      expect(component.find('AddToCartBar').exists()).toBe(true);
      expect(component.find('AddToCartButton').exists()).toBe(true);
      expect(component.find('AddMoreButton').exists()).toBe(true);
      expect(component.find('CartItemsCount').exists()).toBe(true);
    });

    it('should not add when variant selection is not done', () => {
      const component = createComponent(mockedStateVariants);
      component.find('AddToCartButton').simulate('click');
      const actions = store.getActions();
      expect(actions.length).toBe(0);
    });

    it('should handle add to cart and go to cart for variants', () => {
      const component = createComponent(mockedStateVariantsReady);
      const actions = store.getActions();

      component.find('AddToCartButton').simulate('click');
      expect(actions[0].type).toBe(ADD_PRODUCTS_TO_CART);

      expect(component.find('CartItemsCount').prop('itemCount')).toEqual(1);

      component.find('AddToCartButton').simulate('click');
      expect(actions[1].type).toBe(UPDATE_HISTORY);

      component.find('AddMoreButton').simulate('click');
      expect(actions[2].type).toBe(ADD_PRODUCTS_TO_CART);
    });

    it('should not add when variant is not orderable', () => {
      const component = createComponent(mockedStateVariantsNotOrderable);
      component.find('AddToCartButton').simulate('click');
      const actions = store.getActions();
      expect(actions.length).toBe(0);

      component.find('AddMoreButton').simulate('click');
      expect(actions.length).toBe(0);
    });
  });

  describe('Simple Products', () => {
    it('should render car when data is available', () => {
      const component = createComponent(mockedStateSimpleProduct);
      expect(component).toMatchSnapshot();
      expect(component.find('AddToCartBar').exists()).toBe(true);
      expect(component.find('AddToCartButton').exists()).toBe(true);
      expect(component.find('AddMoreButton').exists()).toBe(true);
      expect(component.find('CartItemsCount').exists()).toBe(true);
    });

    it('should handle add to cart and go to cart for variants', () => {
      const component = createComponent(mockedStateSimpleProduct);
      const actions = store.getActions();

      component.find('AddToCartButton').simulate('click');
      expect(actions[0].type).toBe(ADD_PRODUCTS_TO_CART);

      expect(component.find('CartItemsCount').prop('itemCount')).toEqual(1);

      component.find('AddToCartButton').simulate('click');
      expect(actions[1].type).toBe(UPDATE_HISTORY);
      expect(actions[1].historyProps).toEqual('/cart');

      component.find('AddMoreButton').simulate('click');
      expect(actions[2].type).toBe(ADD_PRODUCTS_TO_CART);
    });

    it('should not add when product is not read', () => {
      const component = createComponent(mockedStateSimpleProductNotReady);
      component.find('AddToCartButton').simulate('click');
      const actions = store.getActions();
      expect(actions.length).toBe(0);

      component.find('AddMoreButton').simulate('click');
      expect(actions.length).toBe(0);
    });
  });
});
