/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { mount } from 'enzyme';
import ActionButton from 'Components/ActionButton';
import LoadMore from './index';

jest.mock('./connector', () => Component => Component);

describe('LoadMore', () => {
  it('should render button when reviews number is lower than total reviews count', () => {
    const component = mount(
      <LoadMore
        currentReviewCount={2}
        fetchReviews={() => {}}
        productId="foo"
        totalReviewCount={4}
      />
    );
    expect(component.find('ActionButton').exists()).toBe(true);
  });
  it('should render nothing when reviews number is same as total reviews count', () => {
    const component = mount(
      <LoadMore
        currentReviewCount={2}
        fetchReviews={() => {}}
        productId="foo"
        totalReviewCount={2}
      />
    );
    expect(component.find('ActionButton').exists()).toBe(false);
  });
  it('should render nothing when reviews number is higher than total reviews count', () => {
    const component = mount(
      <LoadMore
        currentReviewCount={3}
        fetchReviews={() => {}}
        productId="foo"
        totalReviewCount={2}
      />
    );
    expect(component.find('ActionButton').exists()).toBe(false);
  });
  it('should render nothing when productId is not passed', () => {
    const component = mount(
      <LoadMore
        currentReviewCount={1}
        fetchReviews={() => {}}
        totalReviewCount={2}
      />
    );
    expect(component.find('ActionButton').exists()).toBe(false);
  });
  it('should call fetchReviews on click', (done) => {
    const fetchReviewsMock = jest.fn();
    const component = mount(
      <LoadMore
        currentReviewCount={1}
        fetchReviews={fetchReviewsMock}
        productId="foo"
        totalReviewCount={2}
      />
    );
    component.find('button').simulate('click');
    expect(component.find('ActionButton').exists()).toBe(true);
    setTimeout(() => {
      expect(fetchReviewsMock).toHaveBeenCalled();
      done();
    }, ActionButton.clickDelay + 1);
  });
});
