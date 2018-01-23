/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Header from './index';

describe('<Header />', () => {
  it('should render with correct title', () => {
    const title = 'My Title';
    const wrapper = shallow(
      <Header title={title} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('GridItem').first().props().children).toEqual(title);
  });
});
