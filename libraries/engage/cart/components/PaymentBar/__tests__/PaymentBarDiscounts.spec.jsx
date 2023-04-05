import React from 'react';
import { shallow } from 'enzyme';
import PaymentBarDiscounts from '../PaymentBarDiscounts';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    currency: 'EUR',
  }),
}));
jest.mock('../PaymentBarDiscounts.connector', () => cmp => cmp);
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/pwa-common-commerce/cart', () => ({
  CART_PAYMENT_BAR_TOTALS_DISCOUNTS: 'CART_PAYMENT_BAR_TOTALS_DISCOUNTS',
}));

describe('<PaymentBarDiscounts />', () => {
  it('should render and match snapshot', () => {
    const discounts = [
      {
        label: 'Coupon',
        amount: 10,
      },
      {
        label: '',
        amount: 2,
      },
    ];
    const wrapper = shallow(<PaymentBarDiscounts discounts={discounts} />).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should be empty render', () => {
    const wrapper = shallow(<PaymentBarDiscounts discounts={null} />);
    expect(wrapper).toBeEmptyRender();
  });
});
