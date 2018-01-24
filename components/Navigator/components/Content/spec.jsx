/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Content from './index';
import Logo from './components/Logo';
import Title from './components/Title';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    historyLength: 1,
    action: 'POP',
    title: 'My Title',
    submitSearch: () => {},
    getQueryParam: () => null,
  };

  return newObj;
});

describe('<Content />', () => {
  it('should render the logo', () => {
    const wrapper = shallow(
      <Content path="/" />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Logo).exists()).toBe(true);
  });

  it('should render the title', () => {
    const wrapper = shallow(
      <Content path="some/other/path" />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Title).exists()).toBe(true);
  });
});
