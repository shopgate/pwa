/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import List from './index';

describe('<List />', () => {
  let list = null;

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

  beforeEach(() => {
    list = mount(<List reviews={[]} />, mockRenderOptions);
  });

  it('should not render when no reviews given', () => {
    expect(list).toMatchSnapshot();
    expect(list.find('Review').exists()).toBe(false);
  });

  it('should render list with reviews', () => {
    list.setProps({ reviews });

    expect(list).toMatchSnapshot();
    expect(list.find('Review').exists()).toBe(true);

    list.find('Review').forEach((node, i) => {
      const ratingNode = node.find('Rating');

      expect(ratingNode.prop('rate')).toEqual(reviews[i].rate);
      expect(ratingNode.find('RatingStars').prop('value')).toEqual(reviews[i].rate);
      expect(node.find('Info').prop('review').date).toEqual(reviews[i].date);

      if (reviews[i].author) {
        expect(node.find('Info').prop('review').author).toEqual(reviews[i].author);
      }

      if (reviews[i].title) {
        expect(node.find('Title').prop('title')).toEqual(reviews[i].title);
      }

      if (reviews[i].review) {
        expect(node.find('Text').prop('review')).toEqual(reviews[i].review);
      }
    });
  });
});
