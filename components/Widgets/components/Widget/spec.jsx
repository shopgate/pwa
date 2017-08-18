/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Grid from '@shopgate/pwa-common/components/Grid';
import Widget from './index';

/**
 * A dummy component.
 * @returns {JSX}
 */
const MyComponent = () => (
  <div />
);

const widgets = {
  'core-widgets/image': MyComponent,
};

describe('<Widget />', () => {
  it('should render an image widget', () => {
    const config = {
      type: 'core-widgets/image',
      col: 1,
      row: 1,
      width: 12,
      height: 6,
    };

    const wrapper = mount(
      <Widget config={config} component={widgets[config.type]} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Grid.Item).exists()).toBe(true);
  });

  it('should not render when the `type` prop is invalid', () => {
    const config = {
      type: 'some_widget', // Invalid
      col: 1,
      row: 1,
      width: 12,
      height: 6,
    };

    const wrapper = mount(
      <Widget config={config} component={widgets[config.type]} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Grid.Item).exists()).toBe(false);
  });
});
