/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import I18n from '@shopgate/pwa-common/components/I18n';
import CheckoutButton from './components/CheckoutButton';
import SubTotal from './components/SubTotal';
import ShippingCosts from './components/ShippingCosts';
import PaymentBar from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('Library/connectors/cart', () => obj => obj);
jest.mock('Library/connectors/history', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    pushHistory: () => {},
  };

  return newObj;
});

describe('<PaymentBar />', () => {
  const testLocales = {
    'shipping.free_short': 'Free',
  };

  const langCode = 'en-US';

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
    const component = wrapper.find(PaymentBar);

    expect(wrapper).toMatchSnapshot();
    expect(component.prop('subTotal')).toEqual(0);
    expect(component.prop('currency')).toEqual('USD');
    expect(component.prop('shipping')).toEqual(null);
    expect(component.find(SubTotal).text()).toEqual('$0.00');
    expect(component.find(ShippingCosts).length).toBe(0);
  });

  it('should show the formatted subtotal', () => {
    const wrapper = renderComponent({ subTotal: 4.99 });
    const component = wrapper.find(PaymentBar);

    expect(wrapper).toMatchSnapshot();
    expect(component.prop('subTotal')).toEqual(4.99);
    expect(component.prop('currency')).toEqual('USD');
    expect(component.prop('shipping')).toEqual(null);
    expect(component.find(SubTotal).text()).toEqual('$4.99');
  });

  it('should show formatted shipping costs', () => {
    const wrapper = renderComponent({ shipping: 2.99 });
    const component = wrapper.find(PaymentBar);

    expect(wrapper).toMatchSnapshot();
    expect(component.prop('subTotal')).toEqual(0);
    expect(component.prop('currency')).toEqual('USD');
    expect(component.prop('shipping')).toEqual(2.99);
    expect(component.find(ShippingCosts).text()).toEqual('$2.99');
  });

  it('should disable the component, if the isDisabled prop is true', () => {
    const wrapper = renderComponent({ isDisabled: true });

    expect(wrapper).toMatchSnapshot();
  });

  it('should disable the checkout button, if the isOrderable prop is false', () => {
    const wrapper = renderComponent({ isOrderable: false });
    const component = wrapper.find(CheckoutButton);

    expect(wrapper).toMatchSnapshot();
    expect(component.prop('checkoutPossible')).toEqual(false);
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
