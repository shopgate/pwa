import React from 'react';
import { render } from '@testing-library/react';
import PriceSlider from './index';

jest.mock('@shopgate/engage/components');
jest.mock('./components/Label', () => function MockLabel() {
  return <div data-testid="price-slider-label" />;
});
jest.mock('@shopgate/engage/filter', () => ({
  FilterItem: ({ children }) => children,
}));

describe('Filter: <PriceSlider />', () => {
  it('should render with default props', () => {
    const wrapper = render(<PriceSlider id="foo" />);
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('should render with custom props', () => {
    const wrapper = render(<PriceSlider id="foo" values={[5, 50]} />);
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });
});
