/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import List from './index';

describe('<List />', () => {
  it('should render with two children', () => {
    const wrapper = mount(
      <List>
        <List.Item title="List Item" />
        <List.Item title="List Item" />
      </List>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(List.Item).length).toEqual(2);
  });
});
