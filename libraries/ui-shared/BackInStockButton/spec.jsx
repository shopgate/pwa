import React from 'react';
import { mount } from 'enzyme';
import BackInStockButton from './index';

describe('<BackInStockButton />', () => {
  it('should render button if not subscribed', () => {
    const wrapper = mount(<BackInStockButton isSubscribed={false} onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render notification if subscribed', () => {
    const wrapper = mount(<BackInStockButton isSubscribed onClick={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
