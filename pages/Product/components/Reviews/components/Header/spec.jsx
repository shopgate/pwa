/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Header from './index';

describe('<Header />', () => {
  let header = null;
  const ratings = [
    {
      average: null,
      count: null,
      reviewCount: null,
    },
    {
      average: 0.7,
      count: 3,
      reviewCount: 3,
    },
  ];

  beforeEach(() => {
    header = mount(<Header rating={null} />);
  });

  it('should render empty', () => {
    expect(header.find('Header').exists()).toBe(true);
    header.setProps({ rating: ratings[0] });

    expect(header).toMatchSnapshot();
    expect(header.find('RatingStars').prop('value')).toEqual(0);
    expect(header.find('RatingCount').prop('count')).toEqual(0);
  });

  it('should render rating summary', () => {
    expect(header.find('Header').exists()).toBe(true);
    header.setProps({ rating: ratings[1] });

    expect(header).toMatchSnapshot();
    expect(header.find('RatingStars').prop('value')).toEqual(ratings[1].average);
    expect(header.find('RatingCount').prop('count')).toEqual(ratings[1].reviewCount);
  });
});
