/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Transition from 'react-transition-group/Transition';
import ProgressBar from './index';

describe('<ProgressBar />', () => {
  it('renders an indeterminate progress bar.', () => {
    const wrapper = shallow(<ProgressBar isVisible />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Transition).length).toBe(1);
  });
});
