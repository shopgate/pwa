import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { ADD_PRODUCTS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
// Import from context since it'll be mocked later
import { defaultContext } from './../../../../context';
import {
  mockedState,
  mockedVariantState,
} from './mock';

const mockedStore = configureStore([thunk]);
const mockedResolver = jest.fn();
jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

jest.mock('./../../../../context');

describe('CTAs (product header)', () => {
  let store;

  afterEach(() => {
    jest.resetAllMocks();
  });
  /**
   * Creates component
   * @param {Object} state Mocked state
   * @param {Object} props Mocked props
   * @return {ReactWrapper}
   */
  const createComponent = (state, props) => {
    store = mockedStore(state);
    /* eslint-disable global-require */
    const CTAButtons = require('./index').default;
    /* eslint-enable global-require */
    return mount(<Provider store={store}><CTAButtons {...props} /></Provider>);
  };

  it('should render CTAButtons when data is available', () => {
    const productId = 'product_1';
    defaultContext.productId = productId;
    const component = createComponent(mockedState, { productId });
    expect(component).toMatchSnapshot();
    expect(component.find('FavoritesButton').exists()).toBe(true);
    expect(component.find('CartButton').exists()).toBe(true);
  });

  it('should handle add to cart', (done) => {
    const productId = 'product_2';
    defaultContext.productId = productId;
    const component = createComponent(mockedVariantState, { productId });
    component.find('CartButton').find('button').simulate('click');
    component.update();

    window.setTimeout(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe(ADD_PRODUCTS_TO_CART);
      done();
    }, 0);
  });
});
