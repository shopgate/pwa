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

  it('should change rating on click', () => {
    const wrapper = shallow(
      <RatingStars value={100} isSelectable />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(StarIcon).length).toBe(10);
    wrapper.setProps({ value: 20 });
    expect(wrapper.find(StarIcon).length).toBe(6);
    wrapper.setProps({ value: 70 });
    expect(wrapper.find(StarIcon).length).toBe(8);
    expect(wrapper.find(StarHalfIcon).length).toBe(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call onSelection callback when component is selectable', () => {
    const spy = jest.fn();
    const wrapper = shallow(
      <RatingStars
        value={100}
        isSelectable
        onSelection={(e) => {
          wrapper.setProps({ value: e.target.value });
          spy();
        }}
      />
    );
    // Click on 1 filled star.
    wrapper.find('[role="button"]').at(5).simulate('click', { target: { value: 10 } });
    expect(spy.mock.calls.length).toBe(1);
    expect(wrapper.find('[role="button"]').length).toBe(6);
    // Click on 4th empty star
    wrapper.find('[role="button"]').at(3).simulate('click', { target: { value: 80 } });
    expect(wrapper.find('[role="button"]').length).toBe(9);
    expect(spy.mock.calls.length).toBe(2);
  });

  it('should NOT call onSelection callback when component is NOT selectable', () => {
    const spy = jest.fn();
    const wrapper = shallow(
      <RatingStars value={100} onSelection={spy} />
    );
    expect(wrapper.find('[role="button"]').length).toBe(0);
  });
});
