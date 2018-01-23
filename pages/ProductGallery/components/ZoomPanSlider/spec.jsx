/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Image from '@shopgate/pwa-common/components/Image';
import ZoomPanSlider from './index';

/**
 * Test element component.
 * @returns {JSX}
 */
const TestElement = () => <Image src="http://placekitten.com/300/300" />;

describe('<ZoomPanSlider />', () => {
  it('renders with children', () => {
    const numChildren = 5;

    const wrapper = mount(
      <ZoomPanSlider>
        <TestElement />
        <TestElement />
        <TestElement />
        <TestElement />
        <TestElement />
      </ZoomPanSlider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(TestElement).length).toBe(numChildren);
  });

  it('wraps children in zoom containers', () => {
    const numChildren = 2;

    const wrapper = mount(
      <ZoomPanSlider>
        <TestElement />
        <TestElement />
      </ZoomPanSlider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ZoomPanContainer').length).toBe(numChildren);
  });
});
