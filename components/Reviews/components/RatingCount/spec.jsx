/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import RatingCount from './index';

describe('<RatingCount>', () => {
  it('should render nothing when count is 0', () => {
    const rating = mount(<RatingCount count={0} />);
    expect(rating.find('span').exists()).toBe(false);
  });
  it('should render text when count is more than 0', () => {
    const rating = mount(<RatingCount count={1} />);
    expect(rating.find('span').exists()).toBe(true);
  });
});
