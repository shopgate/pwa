/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Route from './index';

/**
 * Mock component that will be used for testing purposes
 * @returns {JSX}
 */
const MockComponent = () => null;

describe('<Route />', () => {
  it('should register with Router in context', () => {
    const mockRouterContext = {
      registerRoute: jest.fn(),
    };

    const wrapper = mount((
      <Route path="category/:id" component={MockComponent} />
    ), { context: mockRouterContext });

    /**
     * The route should call the registerRoute function of the context.
     * First parameter should be the path / expression.
     * Third parameter will be the components props.
     */
    expect(wrapper).toMatchSnapshot();
    expect(mockRouterContext.registerRoute).toHaveBeenCalledTimes(1);
    expect(mockRouterContext.registerRoute.mock.calls[0].length).toEqual(6);
    expect(mockRouterContext.registerRoute.mock.calls[0][0]).toEqual('category/:id');
    // Second parameter is a function and can't be compared.

    const call = mockRouterContext.registerRoute.mock.calls[0][5];
    expect(call.component).toEqual(MockComponent);
    expect(call.path).toEqual('category/:id');
  });

  it('should create new instance when notified', () => {
    /**
     * Notify mock
     */
    let add = () => {};
    const mockRouterContext = {
      registerRoute: (path, fnAdd) => { add = fnAdd; },
    };

    const wrapper = mount((
      <Route path="category/:id" component={MockComponent} />
    ), { context: mockRouterContext });

    add(
      {
        key: '123',
        pathname: '/category/123',
      }, { id: 123 });

    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).length).toEqual(1);
    expect(wrapper.find(MockComponent).props()).toEqual({ params: { id: 123 } });
  });

  it('should remove route instance when going back', () => {
    /**
     * Add mock
     */
    let add = () => {};
    /**
     * Remove mock
     */
    let remove = () => {};

    const mockRouterContext = {
      registerRoute: (path, fnAdd, fnRemove) => { add = fnAdd; remove = fnRemove; },
    };

    const wrapper = mount((
      <Route path="category/:id" component={MockComponent} />
    ), { context: mockRouterContext });

    add({
      immutableKey: '123',
      pathname: '/category/123',
    }, { id: 123 });
    add({
      immutableKey: '456',
      pathname: '/category/456',
    }, { id: 456 });
    remove({
      immutableKey: '123',
      pathname: '/category/123',
    }, { id: 123 });

    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).length).toEqual(1);
    expect(wrapper.find(MockComponent).props()).toEqual({ params: { id: 456 } });
  });

  it('should keep two components when going forward', () => {
    /**
     * Notify mock
     */
    let add = () => {};
    const mockRouterContext = {
      registerRoute: (path, fnAdd) => { add = fnAdd; },
    };

    const wrapper = mount((
      <Route path="category/:id" component={MockComponent} />
    ), { context: mockRouterContext });

    add({
      key: '123', pathname: '/category/123',
    }, { id: 123 });
    add({
      key: '456', pathname: '/category/456',
    }, { id: 456 });

    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).length).toEqual(2);
    expect(wrapper.find(MockComponent).at(0).props()).toEqual({ params: { id: 123 } });
    expect(wrapper.find(MockComponent).at(1).props()).toEqual({ params: { id: 456 } });
  });
});
