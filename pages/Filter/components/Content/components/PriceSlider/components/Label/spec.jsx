import React from 'react';
import { shallow } from 'enzyme';
import Label from './index';

describe('PriceSlider: <Label />', () => {
  it('should render', () => {
    const wrapper = shallow(<Label priceLength="5" priceMax={999} priceMin={25} />);
    expect(wrapper).toMatchSnapshot();
  });
});
