import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import Shipping from './index';
import {
  mockedStoreWithShippingPrice,
  mockedStoreWithFreeShipping,
  mockedStoreWithUnknownShipping,
} from './mock';

const mockedStore = configureStore();

describe('Shipping label', () => {
  /**
   * Creates connected the component
   * @param {Object} state The mocked redux state
   * @return {ReactWrapper}
   */
  const createComponent = state => (render(
    <Provider store={mockedStore(state)}>
      <Shipping productId="fakeId" />
    </Provider>,
    mockRenderOptions
  ));

  it('should render shipping price', () => {
    const component = createComponent(mockedStoreWithShippingPrice);
    expect(component.container.firstChild).toMatchSnapshot();
    expect(component.container.textContent).toContain('shipping.cost');
  });

  it('should render free shipping', () => {
    const component = createComponent(mockedStoreWithFreeShipping);
    expect(component.container.firstChild).toMatchSnapshot();
    expect(component.container.textContent).toContain('shipping.free');
  });

  it('should not render when shipping is unknown', () => {
    const component = createComponent(mockedStoreWithUnknownShipping);
    expect(component.container.firstChild).toBeNull();
  });
});
