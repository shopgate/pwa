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
  mockedStateWithAll,
  mockedStateWithoutReview,
  mockedStateWithTwoReviews,
  setMocks,
} from './mock';

const mockedStore = configureStore();

beforeEach(() => {
  jest.resetModules();
});

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @return {ReactWrapper}
 */
const createComponent = (mockedState) => {
  /* eslint-disable global-require */
  const Reviews = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(mockedState)}>
      <Reviews />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Reviews />', () => {
  let component = null;

  it('should render when no reviews and rating given', () => {
    setMocks();
    component = createComponent(mockedStateWithoutReview);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').exists()).toBe(true);
  });

  it('should render reviews, header and all reviews link', () => {
    setMocks();
    component = createComponent(mockedStateWithAll);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').find('div').exists()).toBe(true);
  });

  it('should render reviews, header, but no all reviews link', () => {
    setMocks();
    component = createComponent(mockedStateWithTwoReviews);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(true);
    expect(component.find('List').exists()).toBe(true);
    expect(component.find('AllReviewsLink').find('div').exists()).toBe(false);
  });

  it('should not render when feature flag is off', () => {
    setMocks(false);
    component = createComponent(mockedStateWithAll);
    expect(component).toMatchSnapshot();
    expect(component.find('Header').exists()).toBe(false);
    expect(component.find('List').exists()).toBe(false);
    expect(component.find('AllReviewsLink').exists()).toBe(false);
  });
});
