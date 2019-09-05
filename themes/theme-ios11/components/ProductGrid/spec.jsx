import React from 'react';
import { mount } from 'enzyme';
import ViewProvider from '../../providers/View';
import ProductGrid from '.';

global.console.error = jest.fn();

describe('<ProductGrid />', () => {
  it('should render with the InfineteContainer', () => {
    const wrapper = mount((
      <ViewProvider>
        <ProductGrid products={[]} />
      </ViewProvider>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('InfiniteContainer').exists()).toBe(true);
    expect(wrapper.find('Layout').exists()).toBe(false);
  });

  it('should render the original layout', () => {
    const wrapper = mount((
      <ViewProvider>
        <ProductGrid infiniteLoad={false} products={[]} />
      </ViewProvider>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('InfiniteContainer').exists()).toBe(false);
    expect(wrapper.find('Layout').exists()).toBe(true);
  });
});
