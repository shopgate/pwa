import React from 'react';
import { mount } from 'enzyme';
import ProductGrid from '.';

global.console.error = jest.fn();

jest.mock('@shopgate/engage/components/View');
jest.mock('@shopgate/engage/core', () => ({
  hasWebBridge: jest.fn(() => false),
  isIOSTheme: jest.fn(() => false),
  withForwardedRef: jest.fn(),
  withCurrentProduct: jest.fn(),
  useWidgetSettings: jest.fn().mockReturnValue({}),
}));
jest.mock('@shopgate/pwa-common/components/InfiniteContainer', () =>
  function InfiniteContainer() { return null; });
jest.mock('./components/Iterator', () =>
  function Iterator() { return null; });

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
