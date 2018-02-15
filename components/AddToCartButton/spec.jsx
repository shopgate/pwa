/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import AddToCartButton from './index';

describe('<AddToCartButton />', () => {
  it('should render in loading state and should not be clickable', () => {
    const spy = jest.fn(() => new Promise(resolve => resolve()));

    const wrapper = mount(
      <AddToCartButton handleAddToCart={spy} isLoading isOrderable />
    );
    wrapper.find('button').prop('onClick')();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should render with checkmark icon and should not be clickable the second time', () => {
    const spy = jest.fn(() => new Promise(resolve => resolve()));
    const wrapper = mount(
      <AddToCartButton handleAddToCart={spy} isLoading={false} isOrderable />
    );

    wrapper.find('button').prop('onClick')();
    wrapper.update();

    wrapper.find('button').prop('onClick')();
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render with cart icon and should be clickable', () => {
    const spy = jest.fn(() => new Promise(resolve => resolve()));
    const wrapper = mount(
      <AddToCartButton handleAddToCart={spy} isLoading={false} isOrderable />
    );
    wrapper.find('button').prop('onClick')();

    expect(wrapper).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
