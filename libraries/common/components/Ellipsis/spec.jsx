/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Ellipsis from './index';

const clamp = 3;
const text = 'Some very long text that should be cut off by this ellipsis component.';

describe('<Ellipsis />', () => {
  it('should render', () => {
    const wrapper = shallow(<Ellipsis rows={clamp}>{text}</Ellipsis>);

    expect(wrapper).toMatchSnapshot();
  });
});
