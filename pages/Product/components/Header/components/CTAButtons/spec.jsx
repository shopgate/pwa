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
import { mount } from 'enzyme';
import thunk from 'redux-thunk';

import {
  mockedState,
} from './mock';

describe('CTAs (product header)', () => {
  let store;
  /**
   * Creates component
   * @param {Object} state Mocked state
   * @return {ReactWrapper}
   */
  const createComponent = (state) => {
    const mockedStore = configureStore([thunk]);
    store = mockedStore(state);

    /* eslint-disable global-require */
    const CTAButtons = require('./index').default;
    /* eslint-enable global-require */
    return mount(<Provider store={store}><CTAButtons /></Provider>);
  };

  describe('Rendering', () => {
    it('should render CTAButtons when data is available', () => {
      const component = createComponent(mockedState);
      expect(component).toMatchSnapshot();
      expect(component.find('FavoritesButton').exists()).toBe(true);
    });
  });
});
