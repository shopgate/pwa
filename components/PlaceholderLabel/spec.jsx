/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import PlaceholderLabel from './index';

describe('<PlaceholderLabel />', () => {
  it('should render placeholder ', () => {
    const wrapper = mount(
      <PlaceholderLabel ready={false}>
        <h1>foo</h1>
      </PlaceholderLabel>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('h1').length).toEqual(0);
  });

  it('should render children', () => {
    const wrapper = mount(
      <PlaceholderLabel ready>
        <h1>foo</h1>
      </PlaceholderLabel>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('h1').length).toEqual(1);
  });
});
