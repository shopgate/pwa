/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Slider from './index';

jest.mock('swiper/dist/css/swiper.min.css', () => {});

describe('<Slider />', () => {
  const children = [
    <Slider.Item key="0"><div /></Slider.Item>,
    <Slider.Item key="1"><div /></Slider.Item>,
    <Slider.Item key="2"><div /></Slider.Item>,
  ];

  jest.useFakeTimers();

  it('renders with children', () => {
    const numChildren = children.length;
    const wrapper = shallow(<Slider>{children}</Slider>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Slider.Item).length).toBe(numChildren);
  });

  it('renders with controls', () => {
    const wrapper = mount(<Slider controls>{children}</Slider>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.swiper-button-next').length).toBe(1);
  });

  it('renders with indicators', () => {
    const wrapper = mount((
      <Slider indicators classNames={{ indicator: 'indicator-class' }}>{children}</Slider>
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.indicator-class').length).toBe(1);
  });
});
