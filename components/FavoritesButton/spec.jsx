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
import FavoritesButton from './index';
import {
  mockedStateEmpty,
  mockedStateOnList,
  mockedStateNotOnList,
} from './mock';

const mockedStore = configureStore();
const dispatcher = jest.fn();
beforeEach(() => {
  jest.resetModules();
});

describe('<FavoritesButton />', () => {
  let component = null;

  /**
   * Creates component with provided store state.
   * @param {Object} mockedState Mocked stage.
   * @param {Object} props Additional props.
   * @return {ReactWrapper}
   */
  const createComponent = (mockedState, props) => {
    const store = mockedStore(mockedState);
    store.dispatch = dispatcher;

    return mount(
      <Provider store={store}>
        <FavoritesButton addFavorites={() => {}} removeFavorites={() => {}} {...props} />
      </Provider>,
      mockRenderOptions
    );
  };
  beforeEach(() => {
    dispatcher.mockReset();
  });

  it('should only render when no favorites set', () => {
    component = createComponent(mockedStateEmpty, { active: false });
    expect(component).toMatchSnapshot();

    expect(component.find('Heart').exists()).toBe(false);
    expect(component.find('HeartOutline').exists()).toBe(true);

    component.find('button').simulate('click');
  });

  it('should render when favorites set', () => {
    component = createComponent(mockedStateOnList, { active: true });
    expect(component).toMatchSnapshot();

    expect(component.find('Heart').exists()).toBe(true);
    expect(component.find('HeartOutline').exists()).toBe(false);
  });

  it('should add to favorites on click', () => {
    component = createComponent(mockedStateNotOnList, {
      productId: '1',
      active: false,
    });
    expect(component.find('Heart').exists()).toBe(false);
    expect(component.find('HeartOutline').exists()).toBe(true);

    component.find('button').simulate('click');
    component.update();
    expect(dispatcher.mock.calls.length).toBe(1);
  });

  it('should remove from favorites on click', () => {
    component = createComponent(mockedStateOnList, {
      productId: '1',
      active: true,
    });
    expect(component.find('Heart').exists()).toBe(true);
    expect(component.find('HeartOutline').exists()).toBe(false);

    component.find('button').simulate('click');
    component.update();
    expect(dispatcher.mock.calls.length).toBe(1);
  });
});
