/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import List from 'Components/List';
import { Unwrapped as CategoryListWidget } from './index';

describe.skip('<CategoryListWidget />', () => {
  it('should not render the CategoryListWidget', () => {
    const props = {
      fetchCategory: () => {},
      items: null,
      settings: {
        categoryNumber: '',
        headline: 'Yay Categories',
        showImages: false,
      },
    };

    const wrapper = mount(
      <CategoryListWidget {...props} />
    );

    expect(wrapper.find(List.Item).length).toBe(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the CategoryListWidget', () => {
    const props = {
      fetchCategory: () => {},
      items: [
        {
          id: '1',
          name: 'Headline',
          imageUrl: '/some/url',
        },
        {
          id: '2',
          name: 'Headline',
          imageUrl: '/some/url',
        },
      ],
      settings: {
        categoryNumber: '',
        headline: 'Yay Categories',
        showImages: false,
      },
    };

    const wrapper = mount(
      <CategoryListWidget {...props} />
    );

    expect(wrapper.find(List.Item).length).toBe(2);
    expect(wrapper).toMatchSnapshot();
  });
});
