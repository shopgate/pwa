/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Glow from './index';

describe('<Glow />', () => {
  it('should render with a smile', () => {
    const wrapper = mount(
      <Glow>
        <p>Glowing!</p>
      </Glow>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
