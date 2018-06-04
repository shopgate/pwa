import React from 'react';
import { shallow } from 'enzyme';
import ProductGrid from '../ProductGrid';

describe('<ProductGrid />', () => {
  it('should', () => {
    const wrapper = shallow(<ProductGrid />);

    expect(wrapper).toMatchSnapshot();
  });
});
