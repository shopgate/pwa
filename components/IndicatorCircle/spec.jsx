/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import IndicatorCircle from './index';
import styles from './style';

describe('<IndicatorCircle />', () => {
  it('should apply the given size', () => {
    const wrapper = shallow(
      <IndicatorCircle size={32} />
    );

    expect(wrapper).toMatchSnapshot();

    const svg = wrapper.find('svg');

    expect(svg.props().width).toBe(32);
    expect(svg.props().height).toBe(32);
  });

  it('should apply the given color', () => {
    const wrapper = mount(
      <IndicatorCircle size={32} color="#fff" strokeWidth={4} />
    );

    expect(wrapper).toMatchSnapshot();

    const correctCssClass = styles.circle('#fff', 4);
    const wrongCssClass = styles.circle('#000', 0);
    const circleHtml = wrapper.find('circle');

    expect(circleHtml.html().indexOf(correctCssClass)).toBeGreaterThanOrEqual(0);
    expect(circleHtml.html().indexOf(wrongCssClass)).toBe(-1);
  });
});
