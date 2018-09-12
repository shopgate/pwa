import React from 'react';
import { shallow } from 'enzyme';
import ProductGrid from '../ProductGrid';

describe('<ProductGrid />', () => {
  it('should render with the InfineteContainer', () => {
    const wrapper = shallow(<ProductGrid products={[]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('InfiniteContainer').exists()).toBe(true);
    expect(wrapper.find('Layout').exists()).toBe(false);
  });

  it('should render the original layout', () => {
    const wrapper = shallow(<ProductGrid infiniteLoad={false} products={[]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('InfiniteContainer').exists()).toBe(false);
    expect(wrapper.find('Layout').exists()).toBe(true);
  });
});
