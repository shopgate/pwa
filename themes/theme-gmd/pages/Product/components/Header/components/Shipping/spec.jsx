import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { mount } from 'enzyme';
import Shipping from './index';
import {
  mockedStoreWithShippingPrice,
  mockedStoreWithFreeShipping,
  mockedStoreWithUnknownShipping,
} from './mock';

describe('Shipping label', () => {
  const mockedStore = configureStore();
  it('should render shipping price', () => {
    const component = mount(
      <Provider store={mockedStore(mockedStoreWithShippingPrice)}>
        <Shipping />
      </Provider>,
      mockRenderOptions
    );
    expect(component).toMatchSnapshot();
    expect(component.html().includes('shipping.cost')).toBe(true);
  });
  it('should render free shipping', () => {
    const component = mount(
      <Provider store={mockedStore(mockedStoreWithFreeShipping)}>
        <Shipping />
      </Provider>,
      mockRenderOptions
    );
    expect(component).toMatchSnapshot();
    expect(component.html().includes('shipping.free')).toBe(true);
  });
  it('should not render when shipping is unknown', () => {
    const component = mount(
      <Provider store={mockedStore(mockedStoreWithUnknownShipping)}>
        <Shipping />
      </Provider>,
      mockRenderOptions
    );
    expect(component.html()).toBe(null);
  });
});
