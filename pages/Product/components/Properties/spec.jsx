/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Properties from './index';

jest.mock('./connector', () => obj => obj);

describe('<Properties />', () => {
  const mockStore = configureStore();
  const properties = [
    {
      label: 'foo',
      value: 'bar',
    },
    {
      label: 'bar',
      value: 'foo',
    },
  ];

  it('should not render if no data is available', () => {
    const store = mockStore({ view: { isAnimating: false } });
    const wrapper = mount(
      <Properties store={store} properties={null} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('table').length).toEqual(0);
  });

  it('should render table with properties', () => {
    const store = mockStore({ view: { isAnimating: false } });
    const wrapper = mount(
      <Properties store={store} properties={properties} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('table').length).toEqual(1);
    expect(wrapper.find('td').at(0).text()).toEqual('foo');
    expect(wrapper.find('td').at(1).text()).toEqual('bar');
    expect(wrapper.find('td').at(2).text()).toEqual('bar');
    expect(wrapper.find('td').at(3).text()).toEqual('foo');
  });
});
