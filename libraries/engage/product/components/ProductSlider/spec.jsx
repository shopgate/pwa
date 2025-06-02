/* eslint-disable require-jsdoc */
import React from 'react';
import { shallow } from 'enzyme';
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
  const ProductCard = props => <ProductCard {...props} />;
  return {
    useThemeComponents: () => ({ ProductCard }),
  };
});

describe('<ProductSlider />', () => {
  it('should match snapshot', () => {
    const wrapper = shallow((
      <ProductSlider productIds={['prod1']} />
    ));

    expect(wrapper).toMatchSnapshot();
  });
});
/* eslint-enable require-jsdoc */
