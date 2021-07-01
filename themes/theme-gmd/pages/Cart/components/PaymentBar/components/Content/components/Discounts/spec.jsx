import React from 'react';
import { shallow } from 'enzyme';
import Discounts from '.';

jest.mock('Pages/Cart/context', () => ({
  Consumer: jest.fn(({ children }) => children({
    currency: 'EUR',
  })),
}));
jest.mock('./connector', () => cmp => cmp);

describe('My test', () => {
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
    const wrapper = shallow(<Discounts discounts={discounts} />).dive();
    expect(wrapper).toMatchSnapshot();
  });

  it('should be empty render', () => {
    const wrapper = shallow(<Discounts discounts={null} />);
    expect(wrapper).toBeEmptyRender();
  });
});
