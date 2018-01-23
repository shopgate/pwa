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
import {
  mockedStateWithAll,
  mockedStateProductEmpty,
} from 'Components/Reviews/mock';
import WriteReviewLink from './index';

const mockedStore = configureStore();

/**
 * Creates component with provided store state.
 * @param {Object} mockedState Mocked stage.
 * @return {ReactWrapper}
 */
const createComponent = (mockedState) => {
  const Component = (
    <Provider store={mockedStore(mockedState)}>
      <WriteReviewLink />
    </Provider>
  );
  return mount(Component);
};

describe('<WriteReviewLink>', () => {
  let component = null;

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render when current product is set', () => {
    component = createComponent(mockedStateWithAll);
    expect(component).toMatchSnapshot();
    expect(component.find('span').exists()).toBe(true);
  });

  it('should not render when current product is empty', () => {
    component = createComponent(mockedStateProductEmpty);
    expect(component).toMatchSnapshot();
    expect(component.find('span').exists()).toBe(false);
  });
});
