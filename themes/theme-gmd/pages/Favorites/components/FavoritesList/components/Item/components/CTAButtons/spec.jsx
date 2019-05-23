import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { CREATE_MODAL } from '@shopgate/engage/core';
import { MockedAddToCartButton } from '@shopgate/pwa-ui-shared/AddToCartButton/mock';
import { ADD_PRODUCTS_TO_CART } from '@shopgate/engage/cart';
import { mockedState } from 'Pages/Product/components/Header/components/CTAButtons/mock';

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
    return mount((
      <Provider store={store}>
        <CTAButtons {...props} />
      </Provider>
    ));
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
