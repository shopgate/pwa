/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Image from './index';

window.requestAnimationFrame = () => {};

describe('<Image />', () => {
  const loadedImages = [];
  global.Image = class {
    /**
     * Saves all images on init
     */
    constructor() {
      this.complete = true;
      loadedImages.push(this);
    }
  };

  it('should render placeholders if forced to', () => {
    const wrapper = mount(<Image src="foo/bar" forcePlaceholder />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(0);
  });

  it('should render placeholders if src is null', () => {
    const wrapper = mount(<Image src="foo/bar" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(1);
  });
});
