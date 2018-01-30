/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import ImageWidget from './index';

describe.skip('<ImageWidget />', () => {
  it('should render the ImageWidget', () => {
    const settings = {
      id: '81452',
      alt: 'Alt text',
      image: 'https://data.shopgate.com/shop_widget_images/22874/1a2a3d3.min.jpeg',
      url: '/category/3339',
    };

    const wrapper = shallow(
      <ImageWidget settings={settings} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render the ImageWidget without link', () => {
    const settings = {
      id: '81452',
      alt: 'Alt text',
      image: 'https://data.shopgate.com/shop_widget_images/22874/1a2a3d3.min.jpeg',
      url: '',
    };

    const wrapper = shallow(
      <ImageWidget settings={settings} />
    );

    expect(wrapper.find('Link').exists()).toBe(false);
    expect(wrapper).toMatchSnapshot();
  });
});
