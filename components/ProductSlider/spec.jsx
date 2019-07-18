/* eslint-disable require-jsdoc */
import React from 'react';
import { shallow } from 'enzyme';
import ProductSlider from './index';

jest.mock('@shopgate/engage/components', () => {
  const Swiper = ({ children }) => children;
  Swiper.Item = ({ children }) => children;
  Swiper.Item.displayName = 'Swiper.Item';
  return {
    Swiper,
  };
});
jest.mock('@shopgate/pwa-common/context', () => {
  const ProductCard = props => <ProductCard {...props} />;
  return {
    Theme: ({ children }) => children({ ProductCard }),
  };
});

describe('<ProductSlider />', () => {
  it('should match snapshot', () => {
    const wrapper = shallow((
      <ProductSlider productIds={['prod1']} />
    )).dive();

    expect(wrapper).toMatchSnapshot();
  });
});
/* eslint-enable require-jsdoc */
