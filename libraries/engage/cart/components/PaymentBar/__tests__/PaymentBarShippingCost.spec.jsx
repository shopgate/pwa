/* eslint-disable extra-rules/no-single-line-objects */
import React from 'react';
import { shallow } from 'enzyme';
import { getShippingLine } from '@shopgate/pwa-common-commerce/cart';
import PaymentBarShippingCost from '../PaymentBarShippingCost';

jest.mock('@shopgate/pwa-common-commerce/cart', () => {
  const original = require.requireActual('@shopgate/pwa-common-commerce/cart');
  return {
    ...original, // Pass down all the exported objects
    getShippingLine: jest.fn(),
  };
});
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    currency: 'EUR',
  }),
}));
jest.mock('../PaymentBarShippingCost.connector', () => cmp => cmp);

describe('<PaymentBarShippingCost>', () => {
  it('should render shipping line', () => {
    getShippingLine.mockReturnValue({
      label: 'My label',
      amount: 10,
    });
    const wrapper = shallow((
      <PaymentBarShippingCost shippingCost={{ amount: 10, label: 'Label' }} />
    )).dive();
    expect(wrapper).toMatchSnapshot();
  });
  it('should not render shipping line', () => {
    getShippingLine.mockReturnValue(null);
    const wrapper = shallow((
      <PaymentBarShippingCost shippingCost={{ amount: 10, label: 'Label' }} />
    )).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
