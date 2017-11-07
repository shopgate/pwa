/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
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

  it('renders as non-form element', () => {
    const wrapper = shallow(
      <RatingStars
        value={60}
        isFormElement={false}
      />
    );

    expect(wrapper).toMatchSnapshot();
    const firstStarWrapper = wrapper.find(StarIcon).first().parent('div');
    const lastStarWrapper = wrapper.find(StarIcon).last().parent('div');
    expect(firstStarWrapper.prop('role')).not.toBeDefined();
    expect(firstStarWrapper.prop('onClick')).not.toBeDefined();
    expect(lastStarWrapper.prop('role')).not.toBeDefined();
    expect(lastStarWrapper.prop('onClick')).not.toBeDefined();
  });

  it('renders as form element', () => {
    const wrapper = shallow(
      <RatingStars
        value={60}
        isFormElement
      />
    );

    const firstStarWrapper = wrapper.find(StarIcon).first().parent('div');
    const lastStarWrapper = wrapper.find(StarIcon).last().parent('div');

    expect(wrapper).toMatchSnapshot();
    expect(firstStarWrapper.prop('role')).toEqual('button');
    expect(typeof firstStarWrapper.prop('onClick')).toEqual('function');
    expect(lastStarWrapper.prop('role')).toEqual('button');
    expect(typeof lastStarWrapper.prop('onClick')).toEqual('function');
  });

  it('sets a value on filled star click', (done) => {
    const wrapper = mount(
      <RatingStars
        value={100}
        onSelection={(e) => {
          expect(e.target.value).toEqual(20);
          done();
        }}
        isFormElement
      />
    );

    // Get the first filled star
    const firstStarWrapper = wrapper
      .findWhere(comp => comp.name() === 'div' && comp.key() === `${numEmptyStars + 1}`)
      .first();
    expect(wrapper).toMatchSnapshot();
    expect(firstStarWrapper.prop('role')).toEqual('button');
    expect(typeof firstStarWrapper.prop('onClick')).toEqual('function');
    firstStarWrapper.simulate('click', { target: {} });
  });

  it('sets value on empty star click', (done) => {
    const wrapper = shallow(
      <RatingStars
        value={0}
        onSelection={(e) => {
          expect(e.target.value).toEqual(100);
          done();
        }}
        isFormElement
      />
    );

    // Get the empty star at last position
    const lastStarWrapper = wrapper
      .findWhere(comp => comp.name() === 'div' && comp.key() === `${numEmptyStars}`)
      .first();

    expect(wrapper).toMatchSnapshot();
    expect(lastStarWrapper.prop('role')).toEqual('button');
    expect(typeof lastStarWrapper.prop('onClick')).toEqual('function');
    lastStarWrapper.simulate('click', { target: {} });
  });

  it('should only update if value changed', () => {
    const wrapper = shallow(
      <RatingStars value={60} />
    );

    const shouldUpdate = wrapper.instance().shouldComponentUpdate({ value: 20 }, {});
    expect(shouldUpdate).toBe(true);

    const shouldNotUpdate = wrapper.instance().shouldComponentUpdate({ value: 60 }, {});
    expect(shouldNotUpdate).toBe(false);
  });
});
