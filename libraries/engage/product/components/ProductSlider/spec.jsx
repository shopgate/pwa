import React from 'react';
import { render } from '@testing-library/react';
import ProductSlider from './index';

jest.mock('@shopgate/engage/core', () => ({
  useWidgetSettings: jest.fn(),
}));

jest.mock('@shopgate/engage/components', () => {
  const Swiper = ({ children }) => children;
  Swiper.Item = ({ children }) => children;
  Swiper.Item.displayName = 'Swiper.Item';
  return {
    Swiper,
  };
});

jest.mock('@shopgate/engage/core/hooks', () => {
  const ProductCard = () => <div data-testid="product-card" />;
  return {
    useThemeComponents: () => ({ ProductCard }),
  };
});

describe('<ProductSlider />', () => {
  it('should match snapshot', () => {
    const wrapper = render((
      <ProductSlider productIds={['prod1']} />
    ));

    expect(wrapper.container.firstChild).toMatchSnapshot();
  });
});
