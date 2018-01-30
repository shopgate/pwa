/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Icon from './index';

describe('<CartEmptyIcon />', () => {
  it('should render', () => {
    const wrapper = shallow(<Icon />);

    expect(wrapper).toMatchSnapshot();
  });
});
