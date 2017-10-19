/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import TabBar from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('../connector.js', () => obj => obj);

describe('<TabBar />', () => {
  const defaultProps = {
    visibleTabs: [
      { type: 'foo', label: 'Foo' },
      { type: 'bar', label: 'Bar' },
      { type: 'baz', label: 'Baz' },
      { type: 'qux', label: 'Qux' },
    ],
  };

  it('should render when visible', () => {
    const wrapper = shallow(
      <TabBar {...defaultProps} isVisible />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TabBarAction').length).toBe(defaultProps.visibleTabs.length);
  });

  it('should not render when invisible', () => {
    const wrapper = shallow(
      <TabBar {...defaultProps} isVisible={false} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TabBarAction').length).toBe(0);
  });

  it('should highlight the active tab', () => {
    const wrapper = shallow(
      <TabBar
        {...defaultProps}
        activeTab={'qux'}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TabBarAction[isHighlighted][type="qux"]').length).toBe(1);
  });

  it('should pass custom props to the tab action', () => {
    const customProp = 'my custom prop';

    const wrapper = shallow(
      <TabBar
        visibleTabs={[{ type: 'foo', label: 'bar', customProp }]}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`TabBarAction[customProp="${customProp}"]`).length).toBe(1);
  });
});
