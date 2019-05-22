import React from 'react';
import { shallow } from 'enzyme';
import ProductGallery from './index';

jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: {
    Consumer: jest.fn(({ children }) => children({
      params: {
        productId: '53473130',
        slide: 2,
      },
    })),
  },
}));

describe('<ProductGallery> page', () => {
  it('should render content and an appbar', () => {
    const wrapper = shallow((
      <ProductGallery />
    )).dive().dive();
    expect(wrapper).toMatchSnapshot();
  });
});
