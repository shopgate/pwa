/* eslint-disable react/prop-types */
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useWidgetSettings } from '@shopgate/engage/core';
import { Swiper } from '@shopgate/engage/components';
import {
  getProductImages,
  getCurrentBaseProduct,
} from '@shopgate/engage/product';
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

jest.mock('@shopgate/engage/components', () => {
  // eslint-disable-next-line no-shadow
  const Swiper = jest.fn(({ children }) => children);
  Swiper.Item = ({ children }) => children;

  return {
    Image: ({ src }) => <img src={src} alt="" />,
    Swiper,
    SurroundPortals: ({ children }) => children,
  };
});
jest.mock('@shopgate/engage/product', () => ({
  getProductImages: jest.fn(),
  getCurrentBaseProduct: jest.fn(),
  PRODUCT_GALLERY_IMAGES: 'product.gallery.images',
}));

const mockedStore = configureStore();

describe('<ProductGallery.Content> page', () => {
  beforeEach(() => {
    Swiper.mockClear();
    getProductImages.mockReturnValue([
      'foo', 'bar',
    ]);
    getCurrentBaseProduct.mockReturnValue({ id: 123 });
  });

  it('should render Swiper with images', () => {
    const store = mockedStore();

    const { container } = render((
      <Provider store={store}>
        <Content initialSlide={0} />
      </Provider>
    ));

    expect(Swiper.mock.lastCall[0]).toEqual(expect.objectContaining({
      initialSlide: 0,
      indicators: true,
      loop: true,
      disabled: false,
      zoom: expect.objectContaining({
        enabled: true,
        maxRatio: 4,
      }),
    }));

    const images = Array.from(container.querySelectorAll('.swiper-zoom-container img'));

    expect(images.map(image => image.getAttribute('src'))).toEqual(['foo', 'bar']);
  });

  it('should pass initialSlide prop', () => {
    const store = mockedStore();

    render((
      <Provider store={store}>
        <Content initialSlide={3} />
      </Provider>
    ));

    expect(Swiper.mock.lastCall[0]).toEqual(expect.objectContaining({ initialSlide: 3 }));
  });

  it('should use zoom from widget settings', () => {
    useWidgetSettings.mockReturnValueOnce({
      zoom: {
        maxRatio: 5,
      },
    });

    const store = mockedStore();

    render((
      <Provider store={store}>
        <Content initialSlide={0} />
      </Provider>
    ));

    expect(Swiper.mock.lastCall[0]).toEqual(expect.objectContaining({
      zoom: expect.objectContaining({ maxRatio: 5 }),
    }));
  });
});
/* eslint-enable react/prop-types */
