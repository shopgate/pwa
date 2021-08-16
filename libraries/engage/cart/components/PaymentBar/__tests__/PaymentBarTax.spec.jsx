import React from 'react';
import { shallow } from 'enzyme';
import PaymentBarTax from '../PaymentBarTax';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    currency: 'EUR',
    config: {
      hideTax: false,
      tax: {
        text: null,
        hint: null,
      },
    },
  }),
}));

jest.mock('../PaymentBarTax.connector', () => cmp => cmp);
jest.mock('@shopgate/pwa-common-commerce/cart', () => ({
  CART_PAYMENT_BAR_TOTALS_TAX: 'CART_PAYMENT_BAR_TOTALS_TAX',
  getTaxLine: jest.fn(() => ({
    label: 'Tax',
    amount: 10,
    hint: null,
  })),
}));
jest.mock('@shopgate/engage/components');

describe('<PaymentBarTax />', () => {
  it('should render and match snapshot', () => {
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const wrapper = shallow(<PaymentBarTax taxData={{ label: 'Tax', amount: 10 }} />).dive();
    expect(wrapper).toMatchSnapshot();
  });
  it('should not render and match snapshot', () => {
    const wrapper = shallow(<PaymentBarTax taxData={null} />);
    expect(wrapper).toBeEmptyRender();
  });
});
