/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import {
  mockedState,
} from './components/ReviewForm/mock';

const mockedView = MockedView;
jest.mock('Components/View', () => mockedView);
jest.mock('./components/ReviewForm', () => 'foo');
const mockedStore = configureStore();
/**
 * Creates component
 * @return {ReactWrapper}
 */
const createComponent = () => {
  /* eslint-disable global-require */
  const WriteReview = require('./index').default;
  /* eslint-enable global-require */
  const component = mount(
    <Provider store={mockedStore(mockedState)}>
      <WriteReview />
    </Provider>,
    {
      context: {
        i18n: () => ({
          __: () => 'translation',
        }),
      },
      childContextTypes: {
        i18n: PropTypes.func,
      },
    }
  );
  return component;
};

describe('<WriteReview> page', () => {
  it('should not crash', () => {
    const component = createComponent();
    expect(component.find('WriteReview').exists()).toBe(true);
  });
});
