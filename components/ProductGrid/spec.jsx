import React from 'react';
import { mount } from 'enzyme';
import ProductGrid from '.';

global.console.error = jest.fn();

jest.mock('@shopgate/engage/components/View');

describe('<ProductGrid />', () => {
  it('should render with the InfiniteContainer', () => {
    const wrapper = mount((
      <ProductGrid products={[]} />
    ));

    expect(wrapper).toMatchSnapshot();
  });

  it('should render the original layout', () => {
    const wrapper = mount((
      <ProductGrid infiniteLoad={false} products={[]} />
    ));

    expect(wrapper).toMatchSnapshot();
  });
});
