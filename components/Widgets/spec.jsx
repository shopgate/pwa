/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Widgets from './index';

describe('<Widgets />', () => {
  it('should render a grid if height is defined', () => {
    const widgets = [{
      col: 0,
      row: 0,
      width: 12,
      height: 3,
      settings: {
        id: 83535,
        image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
      },
      type: 'core-widgets/image',
    }];

    const wrapper = mount(
      <Widgets widgets={widgets} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('WidgetGrid').exists()).toBe(true);
  });

  it('should not wrap a widget which is not a grid and has no height', () => {
    const widgets = [{
      col: 0,
      row: 0,
      width: 12,
      settings: {
        id: 83535,
        image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
      },
      type: 'core-widgets/image',
    }];

    const wrapper = mount(
      <Widgets widgets={widgets} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('WidgetGrid').exists()).toBe(false);
  });

  it('should render a grid if the widget is of type grid', () => {
    const widgets = [{
      type: 'core-widgets/widget-grid',
      settings: {
        widgets: [
          {
            col: 0,
            row: 0,
            width: 12,
            height: 5,
            settings: {
              id: '84961',
              alt: '',
              image: 'https://data.shopgate.com/shop_widget_images/23836/aedc545959f55e3f73851eca0ed40a75.min.jpeg',
              link: '/category/',
            },
            type: 'core-widgets/image',
          },
        ],
      },
    }];

    const wrapper = mount(
      <Widgets widgets={widgets} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('WidgetGrid').exists()).toBe(true);
  });
});
