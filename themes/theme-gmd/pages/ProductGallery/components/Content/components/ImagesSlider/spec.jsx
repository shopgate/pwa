import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  getProductImages,
  getCurrentBaseProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { Swiper as MockSwiper } from '@shopgate/pwa-common/components';
import Content from './index';

jest.mock('@shopgate/engage/components', () => ({
  Swiper: MockSwiper,
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductImages: jest.fn(),
  getCurrentBaseProduct: jest.fn(),
}));

const mockedStore = configureStore();

describe('<ProductGallery.Content> page', () => {
  beforeEach(() => {
    getProductImages.mockReturnValue([
      {
        width: 1024,
        height: 1024,
        sources: ['foo1024', 'bar1024'],
      },
      {
        width: 2048,
        height: 2048,
        sources: ['foo2048', 'bar2048'],
      },
    ]);
    getCurrentBaseProduct.mockReturnValue({ id: 123 });
  });

  it('should render Swiper with images', () => {
    const store = mockedStore();

    const wrapper = mount(
      <Provider store={store}>
        <Content initialSlide={0} />
      </Provider>,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockSwiper).length).toEqual(1);
    expect(wrapper.find('img').length).toEqual(2);
    expect(wrapper
      .find('img')
      .at(0)
      .prop('src')).toEqual('foo2048');
    expect(wrapper
      .find('img')
      .at(1)
      .prop('src')).toEqual('bar2048');
  });

  it('should pass initialSlide prop', () => {
    const store = mockedStore();

    const wrapper = mount(
      <Provider store={store}>
        <Content initialSlide={3} />
      </Provider>,
      mockRenderOptions
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockSwiper).prop('initialSlide')).toEqual(3);
  });
});
