/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  mockedStateWithoutReview,
  mockedStateWithInvalidReview,
  mockedStateWithReview,
  mockedStateWithUserReviewLoading,
  mockedStateWithoutProductData,
} from './mock';

const mockedStore = configureStore();

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @param {Function} dispatchSpy Dispatch spy
 * @return {ReactWrapper}
 */
const createComponent = (mockedState, dispatchSpy = jest.fn()) => {
  /* eslint-disable global-require */
  const ReviewForm = require('./index').default;
  const store = mockedStore(mockedState);
  store.dispatch = dispatchSpy;
  /* eslint-enable global-require */
  return mount(
    <Provider store={store}>
      <ReviewForm submit={() => {}} />
    </Provider>,
    mockRenderOptions
  );
};

describe('<ReviewForm />', () => {
  it('should render form correctly', () => {
    const comp = createComponent(mockedStateWithoutReview);
    expect(comp).toMatchSnapshot();
    expect(comp.find('RatingScale').length).toEqual(1);

    const fields = comp.findWhere(c => c.length && c.name() === 'TextField');
    expect(fields.length).toEqual(3);
  });

  it('should render empty', () => {
    const compEmpty = createComponent(mockedStateWithoutProductData);
    expect(compEmpty).toMatchSnapshot();
    expect(compEmpty.exists()).toEqual(true);
  });

  it('should render loading indicator', () => {
    const compLoading = createComponent(mockedStateWithUserReviewLoading);
    expect(compLoading).toMatchSnapshot();
    expect(compLoading.find('LoadingIndicator').length).toEqual(1);
  });

  it('should validate form on submit', () => {
    const comp = createComponent(mockedStateWithoutReview);
    comp.find('form').simulate('submit');
    comp.update();
    expect(comp).toMatchSnapshot();

    const errors = comp.find('ReviewForm').instance().state.validationErrors;
    const author = comp.findWhere(c => (
      c.length && c.name() === 'TextField' && c.prop('name') === 'author'
    ));

    expect(comp.find('RatingScale').prop('value')).toEqual(0);
    expect(comp.find('RatingScale').prop('errorText')).toBeDefined();
    expect(errors.rate).toBeDefined();

    expect(author.prop('value')).toBeFalsy();
    expect(author.prop('errorText')).toBeDefined();
    expect(errors.author).toBeDefined();
  });

  it('should set form data', () => {
    const comp = createComponent(mockedStateWithReview);
    const id = mockedStateWithReview.reviews.userReviewsByProductId.foo.review;
    const review = mockedStateWithReview.reviews.reviewsById[id];
    const form = comp.find('form');

    expect(comp).toMatchSnapshot();
    expect(form.exists()).toEqual(true);
    expect(form.find('RatingScale').prop('value')).toEqual(review.rate);
    expect(form.find('TextField').at(0).prop('value')).toEqual(review.author);
    expect(form.find('TextField').at(1).prop('value')).toEqual(review.title);
    expect(form.find('TextField').at(2).prop('value')).toEqual(review.review);
  });

  it('should validate fields on change', () => {
    const comp = createComponent(mockedStateWithInvalidReview);
    expect(comp).toMatchSnapshot();

    comp.find('form').simulate('submit');
    comp.update();
    expect(comp).toMatchSnapshot();

    // Check validation with to long review
    const errors1 = comp.find('ReviewForm').instance().state.validationErrors;
    const review = comp.findWhere(c => (
      c.length && c.name() === 'TextField' && c.prop('name') === 'review'
    ));
    expect(errors1.review).toBeDefined();

    // Check validation with changed, shorter review
    review.find('textarea').simulate('change', { target: { value: 'Lorem ipsum dolor sit amet' } });
    comp.update();
    expect(comp).toMatchSnapshot();

    const errors2 = comp.find('ReviewForm').instance().state.validationErrors;
    expect(errors2.review).toBeFalsy();

    const longAuthor = new Array(256).fill('a').join('');
    comp.find('input[name="author"]').simulate('change', {
      target: {
        value: longAuthor,
      },
    });
    const errors3 = comp.find('ReviewForm').instance().state.validationErrors;
    expect(errors3.author).toBeTruthy();
    comp.find('input[name="author"]').simulate('change', {
      target: {
        value: 'Author',
      },
    });

    const errors4 = comp.find('ReviewForm').instance().state.validationErrors;
    expect(errors4.author).toBeFalsy();

    comp.find('RatingScale').find('[role="button"]').first().simulate('click');
    expect(comp.find('ReviewForm').instance().state.rate).toBe(20);
  });

  it('should submit with valid review', () => {
    const comp = createComponent(mockedStateWithReview);
    expect(comp).toMatchSnapshot();

    comp.find('form').simulate('submit');
    comp.update();
    const errors = comp.find('ReviewForm').instance().state.validationErrors;
    expect(Object.keys(errors).length).toBe(0);
  });
});
