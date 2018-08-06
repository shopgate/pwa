import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { defaultContext } from './../../__mocks__/context';
import { basicProductState } from './../mock';

const mockedStore = configureStore([thunk]);

jest.mock('Components/Reviews/components/Header', () => () => <div />);

jest.mock('./../../context');

describe.skip('<ProductHeader>', () => {
  /**
   * @param {Object} state A redux store.
   * @returns {JSX}
   */
  const createComponent = (state) => {
    // eslint-disable-next-line global-require
    const ProductHeader = require('./index').default;
    const store = mockedStore(state);
    return mount(
      <Provider store={store}>
        <ProductHeader productId={defaultContext.productId} />
      </Provider>,
      mockRenderOptions
    );
  };

  const components = [
    'CTAButtons',
    'Manufacturer',
    'Availability',
    'Rating',
    'Name',
    'Price',
    'PriceStriked',
    'Shipping',
    'Tiers',
  ];

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render', () => {
    const { productId } = basicProductState.product.currentProduct;
    defaultContext.productId = productId;
    const cmp = createComponent(basicProductState);
    expect(cmp).toMatchSnapshot();
    components.forEach((c) => {
      expect(cmp.find(c).exists()).toBe(true);
    });
  });
});
