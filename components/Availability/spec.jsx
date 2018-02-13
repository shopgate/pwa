/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_WARNING,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants';

import Availability from './index';

describe('<Availability />', () => {
  it('should not render when text is empty', () => {
    const wrapper = mount(
      <Availability text="" />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render by default if state is "ok"', () => {
    const wrapper = mount(
      <Availability state={AVAILABILITY_STATE_OK} text="Available" />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render if state is "ok" when "showWhenAvailable" is set', () => {
    const wrapper = mount(
      <Availability state={AVAILABILITY_STATE_OK} text="Available" showWhenAvailable />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render if state is "warning"', () => {
    const wrapper = mount(
      <Availability state={AVAILABILITY_STATE_WARNING} text="Only 5 left" />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render if state is "warning"', () => {
    const wrapper = mount(
      <Availability state={AVAILABILITY_STATE_ALERT} text="Out of stock" />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
