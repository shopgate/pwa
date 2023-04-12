import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useWidgetSettings } from '@shopgate/engage/core';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  getProductImages,
  getCurrentBaseProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { Swiper as MockSwiper } from '@shopgate/pwa-common/components';
import Content from './index';

jest.mock('@shopgate/engage/core', () => ({
  useWidgetSettings: jest.fn(),
  useLoadImage: jest.fn().mockReturnValue(true),
  getThemeSettings: () => ({
    fillColor: 'FFFFFF',
    HeroImage: [
      {
        width: 1024,
        height: 1024,
      },
    ],
    GalleryImage: [
      {
        width: 2048,
        height: 2048,
      },
    ],
    ListImage: [
      {
        width: 440,
        height: 880,
      },
    ],
  }),
  getFullImageSource: orig => orig,
}));

jest.mock('@shopgate/engage/components', () => ({
  Image: () => 'Image',
  Swiper: MockSwiper,
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductImages: jest.fn(),
  getCurrentBaseProduct: jest.fn(),
}));

const mockedStore = configureStore();

describe('<ProductGallery.Content> page', () => {
  beforeEach(() => {
    getProductImages.mockReturnValue([
      'foo', 'bar',
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
    expect(wrapper.find('Image').length).toEqual(2);
    expect(wrapper
      .find('Image')
      .at(0)
      .prop('src')).toEqual('foo');
    expect(wrapper
      .find('Image')
      .at(1)
      .prop('src')).toEqual('bar');
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

  it('should use zoom from widget settings', () => {
    useWidgetSettings.mockReturnValueOnce({
      zoom: {
        maxRatio: 5,
      },
    });

    const store = mockedStore();

    const wrapper = mount(
      <Provider store={store}>
        <Content initialSlide={0} />
      </Provider>,
      mockRenderOptions
    );

    expect(wrapper.find('Swiper').prop('zoom')).toHaveProperty('maxRatio', 5);
  });
});
