import React from 'react';
import { shallow } from 'enzyme';
import { UnwrappedCouponField as CouponField } from './index';
import Layout from './components/Layout';

describe('<CouponField />', () => {
  it('should render as expected without any props', () => {
    const wrapper = shallow(<CouponField visible />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Layout).length).toBe(1);
  });

  it('should render a message when the cart supports coupons', () => {
    const wrapper = shallow(<CouponField visible isSupported />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Layout).length).toBe(1);
  });

  it('should render a message when the cart does not support coupons', () => {
    const wrapper = shallow(<CouponField visible isSupported={false} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Layout).length).toBe(0);
  });
});
