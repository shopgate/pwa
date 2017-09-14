/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Reviews from './index';

jest.mock('./connector', () => obj => obj);

describe('<Reviews />', () => {
  let component = null;

  const reviews = [
    {
      author: '',
      date: '2017-09-06T12:38:51.000Z',
      rate: 100,
      title: '',
      review: 'No Name and Title Lorem ipsum dolor sit amet, con… takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      author: 'username123',
      date: '2017-09-06T12:37:40.000Z',
      rate: 40,
      title: 'Test review 2 ',
      review: 'Lorem ipsum dolor sit amet, consetetur sadipscing … takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      author: 'Carina Hoffmann',
      date: '2017-09-06T12:30:23.000Z',
      rate: 60,
      title: '',
      review: 'Test review',
    },
    {
      author: '',
      date: '2017-09-06T12:30:23.000Z',
      rate: 20,
      title: '',
      review: '',
    },
  ];

  const rating = {
    average: 60,
    count: 3,
    reviewCount: 3,
  };

  beforeEach(() => {
    component = mount(<Reviews reviews={[]} rating={{}} />);
  });

  it('should not render when no reviews and rating given', () => {
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(false);
    expect(component.find('List').exists()).toBe(false);
  });

  it('should render reviews and header', () => {
    component.setProps({ reviews, rating });

    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
  });
});
