/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  mockedEmptyState,
} from './mock';

const mockedView = MockedView;
const mockedStore = configureStore();
jest.mock('Components/View', () => mockedView);
jest.mock('./connector', () => Component => Component);
/**
 * Creates component
 * @return {ReactWrapper}
 */
const createComponent = () => {
  /* eslint-disable global-require */
  const Favorites = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(mockedEmptyState)}>
      <Favorites products={[]} />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Favorites> page', () => {
  describe('Empty page', () => {
    it('should render empty page', () => {
      const component = createComponent();
      expect(component).toMatchSnapshot();
      expect(component.find('EmptyFavorites').exists()).toBe(true);
    });
  });
});
