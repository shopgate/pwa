import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import PriceSlider from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/filter', () => ({
  FilterItem: ({ children }) => children,
}));

describe('Filter: <PriceSlider />', () => {
  it('should render with default props', () => {
    const wrapper = render(<PriceSlider id="foo" />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should render with custom props', () => {
    const wrapper = render(<PriceSlider id="foo" values={[5, 50]} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
