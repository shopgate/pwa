/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { Unwrapped as ApplyFilterButton } from './index';

describe('<ApplyFilterButton />', () => {
  it('it should render', () => {
    const wrapper = shallow(
      <ApplyFilterButton
        applyFilters={() => {}}
        goBackHistory={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger the applyFilters function', () => {
    const applyFiltersSpy = jest.fn();

    const wrapper = shallow(
      <ApplyFilterButton
        applyFilters={applyFiltersSpy}
      />
    );

    wrapper.simulate('click', { preventDefault: () => {} });
    expect(applyFiltersSpy).toHaveBeenCalled();
  });

  it('should not trigger the applyFilters function when there are no filter changes', () => {
    const applyFiltersSpy = jest.fn();

    const wrapper = mount(
      <ApplyFilterButton
        applyFilters={applyFiltersSpy}
        filtersChanged={false}
      />
    );

    wrapper.simulate('click', { preventDefault: () => {} });
    expect(applyFiltersSpy).not.toHaveBeenCalled();
  });
});
