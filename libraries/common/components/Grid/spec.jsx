/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import Grid from './index';

describe('<Grid />', () => {
  it('should render without any further props', () => {
    const wrapper = shallow(<Grid />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should be able to render a custom tag', () => {
    const wrapper = shallow(<Grid component="article" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.type()).toEqual('article');
  });

  it('should add custom classes on demand', () => {
    const wrapper = shallow(<Grid className="custom-class-name" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.hasClass('custom-class-name')).toEqual(true);
  });
});
