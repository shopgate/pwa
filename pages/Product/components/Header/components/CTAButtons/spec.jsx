import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { ADD_PRODUCTS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import {
  mockedState,
  mockedVariantState,
} from './mock';

const mockedResolver = jest.fn();
jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

describe('CTAs (product header)', () => {
  let store;
  beforeEach(() => {
    jest.resetModules();
  });
  /**
   * Creates component
   * @param {Object} state Mocked state
   * @param {Object} props Mocked props
   * @return {ReactWrapper}
   */
  const createComponent = (state, props) => {
    const mockedStore = configureStore([thunk]);
    store = mockedStore(state);

    /* eslint-disable global-require */
    const CTAButtons = require('./index').default;
    /* eslint-enable global-require */
    return mount(<Provider store={store}><CTAButtons {...props} /></Provider>);
  };

  it('should render CTAButtons when data is available', () => {
    const component = createComponent(mockedState, { productId: 'product_1' });
    expect(component).toMatchSnapshot();
    expect(component.find('FavoritesButton').exists()).toBe(true);
    expect(component.find('AddToCartButton').exists()).toBe(true);
  });

  it('should handle add to cart', () => {
    const component = createComponent(mockedVariantState, { productId: 'product_2' });
    component.find('AddToCartButton').find('button').simulate('click');
    component.update();

    const actions = store.getActions();
    expect(actions[0].type).toBe(ADD_PRODUCTS_TO_CART);
  });
});
