/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import I18n from '@shopgate/pwa-common/components/I18n';
import CheckoutButton from './components/CheckoutButton';
import SubTotal from './components/SubTotal';
import ShippingCosts from './components/ShippingCosts';
import PaymentBar from './index';

/**
 * Mock the connect() methods of the relevant sub-components.
 */
jest.mock('./components/CheckoutButton/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isActive: true,
  };

  return newObj;
});

jest.mock('./components/ShippingCosts/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    currency: 'USD',
    value: 2.99,
  };

  return newObj;
});

jest.mock('./components/ShippingCostsLabel/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    shipping: 2.99,
  };

  return obj;
});

jest.mock('./components/SubTotal/connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isDisabled: false,
    currency: 'USD',
    value: 4.99,
  };

  return newObj;
});

jest.mock('./components/SubTotalLabel/connector', () => (obj) => {
    const newObj = obj;

    newObj.defaultProps = {
      ...newObj.defaultProps,
      isDisabled: false,
    };

    return newObj;
});

describe('<PaymentBar />', () => {
  const mockStore = configureStore();
  const testLocales = {
    'shipping.free_short': 'Free',
  };

  const langCode = 'en-US';

  const store = mockStore({
    view: { isLoading: false },
  });

  /**
   * Renders the component.
   * @param {Object} props The component props.
   * @return {Object} The mounted component.
   */
  const renderComponent = (props = {}) => mount(
    <I18n.Provider lang={langCode} locales={testLocales}>
      <PaymentBar {...props} currency="USD" />
    </I18n.Provider>
  );

  it('should render without any props', () => {
    const wrapper = renderComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should show the formatted subtotal', () => {
    const wrapper = renderComponent({});
    const component = wrapper.find(PaymentBar);

    expect(wrapper).toMatchSnapshot();
    expect(component.find(SubTotal).text()).toEqual('$4.99');
  });

  it('should show formatted shipping costs', () => {
    const wrapper = renderComponent({});
    const component = wrapper.find(PaymentBar);

    expect(wrapper).toMatchSnapshot();
    expect(component.find(ShippingCosts).text()).toEqual('$2.99');
  });

  it('should disable the component, if the isDisabled prop is true', () => {
    const wrapper = renderComponent({ isDisabled: true });

    expect(wrapper).toMatchSnapshot();
  });

  it('should be visible if prop isVisible is true', () => {
    const wrapper = renderComponent({ isVisible: true });

    expect(wrapper.find('FormatPrice').exists()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should not be visible if prop isVisible is false', () => {
    const wrapper = renderComponent({ isVisible: false });

    expect(wrapper.find('FormatPrice').exists()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });
});
