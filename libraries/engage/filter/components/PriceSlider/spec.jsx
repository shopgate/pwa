import React from 'react';
import { shallow } from 'enzyme';
import PriceSlider from './index';

describe('Filter: <PriceSlider />', () => {
  it('should render with default props', () => {
    const wrapper = shallow(<PriceSlider id="foo" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom props', () => {
    const wrapper = shallow(<PriceSlider id="foo" values={[5, 50]} />);
    expect(wrapper).toMatchSnapshot();
  });
});
