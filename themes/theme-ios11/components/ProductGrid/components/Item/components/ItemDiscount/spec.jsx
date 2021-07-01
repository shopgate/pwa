import React from 'react';
import { shallow } from 'enzyme';
import ItemDiscount from './index';

describe('<ItemDiscount />', () => {
  it('should render without discount', () => {
    const wrapper = shallow(<ItemDiscount productId="1234" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with discount', () => {
    const wrapper = shallow(<ItemDiscount productId="1234" discount={12} />);
    expect(wrapper).toMatchSnapshot();
  });
});
