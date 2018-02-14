/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Sheet from './index';

window.requestAnimationFrame = () => {};

describe('<Sheet />', () => {
  it('should render closed without content', () => {
    const wrapper = shallow(
      <Sheet />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render opened without content', () => {
    const wrapper = shallow(
      <Sheet isOpen />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with content and title', () => {
    const wrapper = shallow(
      <Sheet isOpen title="Test-Title">
        <div>Test</div>
      </Sheet>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger onClose callback and close the Sheet', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <Sheet isOpen title="Test-Title" onClose={spy}>
        <div>Test</div>
      </Sheet>
    );

    // Trigger a click on the close button of the Sheet.
    wrapper.find('button').first().simulate('click');

    return new Promise((resolve) => {
      // Wait until the drawer is closed and has updated it's state.
      setTimeout(() => {
        resolve();
      }, wrapper.find('Drawer').prop('animation').duration);
    }).then(() => {
      // Check if onClose callback was called.
      expect(spy).toHaveBeenCalled();

      // Check if the Drawer compnent was closed.
      expect(wrapper.find('Drawer').prop('isOpen')).not.toBeTruthy();

      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should open', () => {
    const wrapper = mount(
      <Sheet isOpen={false} title="Test-Title">
        <div>Test</div>
      </Sheet>
    );

    wrapper.setProps({ isOpen: true });
    expect(wrapper.find('Drawer').prop('isOpen')).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
