/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Backdrop from './index';

describe('<Backdrop />', () => {
  let mockOpen;

  beforeEach(() => {
    mockOpen = jest.fn();
  });

  it('should render', () => {
    const wrapper = shallow(<Backdrop isVisible />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should execute callback when Backdrop is clicked', () => {
    const wrapper = shallow(<Backdrop isVisible onClick={mockOpen} />);
    wrapper.find('div').simulate('click');
    expect(mockOpen).toBeCalled();
  });
});
