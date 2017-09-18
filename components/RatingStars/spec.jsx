/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import StarIcon from 'Components/icons/StarIcon';
import StarHalfIcon from 'Components/icons/StarHalfIcon';
import RatingStars from './index';

const numEmptyStars = 5;

describe('<RatingStars />', () => {
  it('renders with value of 50', () => {
    const wrapper = shallow(
      <RatingStars value={50} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars + 2);
    expect(wrapper.find(StarHalfIcon).length).toBe(1);
  });

  it('renders with value of 0', () => {
    const wrapper = shallow(
      <RatingStars value={0} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars);
    expect(wrapper.find(StarHalfIcon).length).toBe(0);
  });

  it('renders with value of 100', () => {
    const wrapper = shallow(
      <RatingStars value={100} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(numEmptyStars + 5);
    expect(wrapper.find(StarHalfIcon).length).toBe(0);
  });
});
