/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Button from './index';

describe('<Button />', () => {
  it('should render the button', () => {
    const wrapper = shallow(<Button>My content</Button>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('button').length).toBe(1);
  });

  it('should render the button in disabled state', () => {
    const wrapper = shallow(<Button disabled>My content</Button>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('button[disabled]').length).toBe(1);
  });

  it('should trigger the click event', () => {
    const callback = jest.fn();

    const wrapper = shallow(<Button onClick={callback}>My content</Button>);

    wrapper.simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(callback).toHaveBeenCalled();
  });

  it('should not trigger the click event when disabled', () => {
    const callback = jest.fn();

    const wrapper = shallow(<Button disabled onClick={callback}>My content</Button>);

    wrapper.simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(callback).not.toHaveBeenCalled();
  });
});
