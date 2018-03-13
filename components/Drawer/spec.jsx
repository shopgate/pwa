/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import Drawer from './index';

describe('<Drawer />', () => {
  let mockOpen;

  beforeEach(() => {
    mockOpen = jest.fn();
  });

  it('should render', () => {
    const wrapper = shallow(<Drawer />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should execute callback when drawer is opened', () => {
    const wrapper = mount(<Drawer onOpen={mockOpen} />);
    wrapper.setProps({
      isOpen: true,
    });

    expect(mockOpen).toBeCalled();
  });

  it('should execute callback when drawer is closed', () => {
    const wrapper = mount(<Drawer isOpen onClose={mockOpen} />);
    wrapper.setProps({
      isOpen: false,
    });

    expect(mockOpen).toBeCalled();
  });

  it('should add custom classes', () => {
    const wrapper = mount(<Drawer className="custom-class-name" isOpen />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.hasClass('custom-class-name')).toEqual(true);
  });

  it('should execute callback when drawer close animation did end', () => {
    const wrapper = mount(<Drawer className="custom-class-name" isOpen onDidClose={mockOpen} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({
      isOpen: false,
    });
    wrapper.simulate('animationEnd');
    expect(mockOpen).toBeCalled();
  });
});
