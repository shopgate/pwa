/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  mockedState,
} from './components/ReviewForm/mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);
jest.mock('./components/ReviewForm', () => () => '');
const mockedStore = configureStore();
/**
 * Creates component
 * @return {ReactWrapper}
 */
const createComponent = () => {
  /* eslint-disable global-require */
  const WriteReview = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(mockedState)}>
      <WriteReview />
    </Provider>,
    mockRenderOptions
  );
};

describe('<WriteReview> page', () => {
  it('should not crash', () => {
    const component = createComponent();
    expect(component.find('WriteReview').exists()).toBe(true);
  });
});
