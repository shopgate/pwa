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
      average: 0,
      count: 0,
      reviewCount: 0,
    },
    {
      average: 70,
      count: 3,
      reviewCount: 3,
    },
  ];

  beforeEach(() => {
    header = mount(<Header rating={{}} />);
  });

  it('should render empty', () => {
    expect(header.find('Header').exists()).toBe(true);
    header.setProps({ rating: ratings[0] });

    expect(header).toMatchSnapshot();
    expect(header.find('RatingStars').prop('value')).toEqual(0);
    expect(header.find('RatingCount').exists()).toBe(false);
  });

  it('should render rating summary', () => {
    expect(header.find('Header').exists()).toBe(true);
    header.setProps({ rating: ratings[1] });

    expect(header).toMatchSnapshot();
    expect(header.find('RatingStars').prop('value')).toEqual(ratings[1].average);
    expect(header.find('RatingCount').prop('count')).toEqual(ratings[1].reviewCount);
  });
});
