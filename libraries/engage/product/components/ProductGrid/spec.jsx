import React from 'react';
import { mount } from 'enzyme';
import ProductGrid from '.';

global.console.error = jest.fn();

jest.mock('@shopgate/engage/core', () => ({
  hasWebBridge: jest.fn(() => false),
  isIOSTheme: jest.fn(() => false),
  withForwardedRef: jest.fn(),
  withCurrentProduct: jest.fn(),
  useWidgetSettings: jest.fn().mockReturnValue({}),
}));
jest.mock('@shopgate/engage/components', () => {
  const { ViewContext } = jest.requireActual('@shopgate/engage/components/View/context');
  return {
    ViewContext,
    InfiniteContainer: () => null,
    Grid: () => null,
  };
});

jest.mock('./components/Iterator', () =>
  function Iterator() { return null; });

jest.mock('@shopgate/engage/product', () => ({
  ProductListTypeProvider: ({ children }) => children,
  ProductListEntryProvider: ({ children }) => children,
}));

describe('<ProductGrid />', () => {
  it('should render with the InfiniteContainer', () => {
    const wrapper = mount((
      <ProductGrid products={[]} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('InfiniteContainer').exists()).toBe(true);
    expect(wrapper.find('Layout').exists()).toBe(false);
  });

  it('should render the original layout', () => {
    const wrapper = mount((
      <ProductGrid infiniteLoad={false} products={[]} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('InfiniteContainer').exists()).toBe(false);
    expect(wrapper.find('Layout').exists()).toBe(true);
  });
});
