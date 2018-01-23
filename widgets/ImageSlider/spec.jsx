/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Image from '@shopgate/pwa-common/components/Image';
import Slider from '@shopgate/pwa-common/components/Slider';
import ImageSliderWidget from './index';

describe.skip('<ImageSliderWidget />', () => {
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

  const testContext = {
    router: {
      push: () => {},
    },
  };

  beforeEach(() => {
    // We don't care about the router.
    Link.contextTypes = {
      router: React.PropTypes.any,
    };
  });

  it('should render the slider with the correct number of images', () => {
    const mySettings = {
      ...testSettings,
      images: [
        testImage,
        testImage,
        testImage,
      ],
    };

    const wrapper = mount((
      <ImageSliderWidget settings={mySettings} />
      ),
      testContext
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Slider.Item).length).toBe(mySettings.images.length);

    const images = wrapper.find(Image);
    expect(images.length).toBe(mySettings.images.length);
  });

  it('should map the correct image settings to the components', () => {
    const mySettings = {
      ...testSettings,
      images: [
        testImage,
        testImage2,
      ],
    };

    const wrapper = mount(
      <ImageSliderWidget settings={mySettings} />
    );

    expect(wrapper).toMatchSnapshot();
    const images = wrapper.find(Image);
    let index = 0;
    images.forEach((image) => {
      const imageProps = image.props();
      const imageSettings = mySettings.images[index];
      index += 1;

      expect(imageProps.src).toBe(imageSettings.image);
    });
  });

  it('should render no slider with just a single image', () => {
    const mySettings = {
      ...testSettings,
      images: [
        testImage,
      ],
    };

    const wrapper = mount(
      <ImageSliderWidget settings={mySettings} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Slider.Item).length).toBe(0);
  });

  it('should render the images unlinked if no link is set', () => {
    const mySettings = {
      ...testSettings,
      images: [
        {
          ...testImage,
          link: null,
        },
      ],
    };

    const wrapper = mount(
      <ImageSliderWidget settings={mySettings} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Link).length).toBe(0);
  });

  it('should render the images with links', () => {
    const mySettings = {
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

    const wrapper = mount(
      <ImageSliderWidget settings={mySettings} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Link).length).toBe(mySettings.images.length - 1);
  });
});
