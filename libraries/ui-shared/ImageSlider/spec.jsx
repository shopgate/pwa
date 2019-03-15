/* eslint-disable react/jsx-closing-tag-location,eslint-comments/disable-enable-pair */
import React from 'react';
import { shallow, mount } from 'enzyme';
import Image from '@shopgate/pwa-common/components/Image';
import { Swiper } from '@shopgate/pwa-common/components';
import ImageSlider from './index';

describe('<ImageSlider />', () => {
  it('should not use a slider for only one image', () => {
    const wrapper = mount(<ImageSlider>
      <Image srcmap={['foo/bar']} />
    </ImageSlider>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Swiper.Item).exists()).toBe(false);
  });

  it('should wrap each image into a Swiper.Item', () => {
    const wrapper = shallow(<ImageSlider>
      <Image srcmap={['foo/bar']} />
      <Image srcmap={['bar/foo']} />
    </ImageSlider>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Swiper.Item).length).toBe(2);
    expect(wrapper
      .find(Swiper.Item)
      .at(0)
      .find(Image).length).toBe(1);
    expect(wrapper
      .find(Swiper.Item)
      .at(1)
      .find(Image).length).toBe(1);
  });
});
