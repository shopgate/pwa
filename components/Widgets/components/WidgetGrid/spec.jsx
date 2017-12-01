/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import WidgetGrid from './index';

/**
 * A mock Image component.
 * @returns {JSX}
 */
const Image = () => <div />;

const components = {
  '@shopgate/commerce-widgets/image': Image,
};

describe('<WidgetGrid />', () => {
  it('should render with a config', () => {
    const config = [{
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
      <WidgetGrid config={config} components={components} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render without a `config` prop', () => {
    const wrapper = mount(
      <WidgetGrid components={components} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div').children().length).toBe(0);
  });
});
