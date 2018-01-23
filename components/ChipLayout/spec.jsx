/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Chip from 'Components/Chip';
import ChipsLayout from './index';

/**
 * Since the component uses the <Measure> component it needs an actual
 * browser to be tested as it needs a full browser that supports styling and
 * width/height calculation.
 */
describe('<ChipsLayout />', () => {
  it('should render with one chip', () => {
    const Component = (
      <ChipsLayout>
        <Chip>foo</Chip>
      </ChipsLayout>
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Chip).length).toEqual(1);
    expect(wrapper.find(Chip).at(0).find('button').at(1)
      .text()).toEqual('foo');
  });

  it('should render with two chips', () => {
    const Component = (
      <ChipsLayout>
        <Chip>foo</Chip>
        <Chip>bar</Chip>
      </ChipsLayout>
    );
    const wrapper = mount(Component);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Chip).length).toEqual(2);
    expect(wrapper.find(Chip).at(0).find('button').at(1)
      .text()).toEqual('foo');
    expect(wrapper.find(Chip).at(1).find('button').at(1)
      .text()).toEqual('bar');
  });
});
