import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import ImageSliderWidget from './index';

const mockedStore = configureStore();
/**
 * Creates component
 * @param {Object} props Component props.
 * @return {ReactWrapper}
 */
const createComponent = (props = {}) => mount(
  <Provider store={mockedStore({})}>
    <ImageSliderWidget {...props} />
  </Provider>,
  mockRenderOptions
);

describe('<ImageSliderWidget />', () => {
  const testImage = {
    image: 'http://placehold.it/350x150',
    link: 'http://example.com',
  };

  const testImage2 = {
    image: 'http://placehold.it/10x10',
    link: 'http://other.example.com',
  };

  const testSettings = {
    autostart: false,
    delay: 7000,
    pagination: true,
    loop: false,
    images: [],
  };

  it('should render the slider with the correct number of images', () => {
    const settings = {
      ...testSettings,
      images: [
        testImage,
        testImage,
        testImage,
      ],
    };

    const wrapper = createComponent({ settings });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SliderItem').length).toBe(settings.images.length);

    const images = wrapper.find('img');
    expect(images.length).toBe(settings.images.length);
  });

  it('should map the correct image settings to the components', () => {
    const settings = {
      ...testSettings,
      images: [
        testImage,
        testImage2,
      ],
    };

    const wrapper = createComponent({ settings });

    expect(wrapper).toMatchSnapshot();
    const images = wrapper.find('Image');
    let index = 0;
    images.forEach((image) => {
      const imageProps = image.props();
      const imageSettings = settings.images[index];
      index += 1;

      expect(imageProps.src).toBe(imageSettings.image);
    });
  });

  it('should render no slider with just a single image', () => {
    const settings = {
      ...testSettings,
      images: [
        testImage,
      ],
    };

    const wrapper = createComponent({ settings });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SliderItem').length).toBe(0);
    expect(wrapper.find('img').length).toBe(1);
  });

  it('should render the images unlinked if no link is set', () => {
    const settings = {
      ...testSettings,
      images: [
        {
          ...testImage,
          link: null,
        },
      ],
    };

    const wrapper = createComponent({ settings });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Link').length).toBe(0);
    expect(wrapper.find('img').length).toBe(1);
  });

  it('should render the images with links', () => {
    const settings = {
      ...testSettings,
      images: [
        testImage,
        {
          // Add an image without a link
          ...testImage,
          link: null,
        },
        testImage,
        testImage,
      ],
    };

    const wrapper = createComponent({ settings });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Link').length).toBe(settings.images.length - 1);
  });
});
