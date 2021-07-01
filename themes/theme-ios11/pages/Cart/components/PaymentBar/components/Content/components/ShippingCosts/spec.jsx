/* eslint-disable extra-rules/no-single-line-objects */
import React from 'react';
import { shallow } from 'enzyme';
import { getShippingLine } from '@shopgate/pwa-common-commerce/cart';
import ShippingCosts from '.';

jest.mock('@shopgate/pwa-common-commerce/cart', () => {
  const original = require.requireActual('@shopgate/pwa-common-commerce/cart');
  return {
    ...original, // Pass down all the exported objects
    getShippingLine: jest.fn(),
  };
});
jest.mock('Pages/Cart/context', () => ({
  Consumer: jest.fn(({ children }) => children({
    currency: 'EUR',
  })),
}));
jest.mock('./connector', () => cmp => cmp);

describe('<ShippingCosts>', () => {
  it('should render shipping line', () => {
    getShippingLine.mockReturnValue({
      label: 'My label',
      amount: 10,
    });
    const wrapper = shallow(<ShippingCosts shippingCost={{ amount: 10, label: 'Label' }} />).dive();
    expect(wrapper).toMatchSnapshot();
  });
  it('should not render shipping line', () => {
    getShippingLine.mockReturnValue(null);
    const wrapper = shallow(<ShippingCosts shippingCost={{ amount: 10, label: 'Label' }} />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
