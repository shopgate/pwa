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
  mockedState,
  mockedEmptyState,
} from './mock';

const mockedView = MockedView;
const mockedStore = configureStore();
jest.mock('Components/View', () => mockedView);
jest.mock('@shopgate/pwa-common/actions/history/goBackHistory', () => () => ({
  type: 'goback',
}));
/**
 * Creates component
 * @param {boolean} withProducts Store with or without products would be used.
 * @return {ReactWrapper}
 */
const createComponent = (withProducts = false) => {
  /* eslint-disable global-require */
  const Favorites = require('./index').default;
  const state = withProducts ? mockedState : mockedEmptyState;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(state)}>
      <Favorites />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Favorites> page', () => {
  describe('Empty page', () => {
    let component;
    it('should render an empty page', () => {
      component = createComponent();
      expect(component).toMatchSnapshot();
      expect(component.find('EmptyFavorites').exists()).toBe(true);
    });
    it('should not update when products are still empty', () => {
      expect(component
        .find('EmptyFavorites').instance().shouldComponentUpdate({ products: [] }))
        .toBe(false);
      component.find('ContinueButton').get(0).props.goBackHistory();
    });
  });
  describe('Page with items', () => {
    it('should render a page with products', () => {
      const component = createComponent(true);
      expect(component.find('EmptyFavorites').html()).toBe(null);
    });
  });
});
