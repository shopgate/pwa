/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Router from './index';
import MockRoute from './components/Route/mock';
import HistoryStack from './helpers/HistoryStack';

describe('<Router />', () => {
  it('should notify route about initial location', () => {
    const mockHistory = new HistoryStack({
      key: 'c123',
      pathname: '/category/123',
    });
    const mockAdd = jest.fn();

    const wrapper = mount(
      <Router history={mockHistory}>
        <MockRoute mockAdd={mockAdd} path="/category/:id" />
      </Router>
    );

    expect(wrapper).toMatchSnapshot();
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith(
      {
        key: 'c123',
        pathname: '/category/123',
      },
      {
        id: '123',
      },
      undefined
    );
  });

  it('should notify previous route to hide and new one to show', () => {
    const mockHistory = new HistoryStack({
      key: 'c123',
      pathname: '/category/123',
    });
    const mockAddCategory = jest.fn();
    const mockHideCategory = jest.fn();
    const mockAddProduct = jest.fn();

    const wrapper = mount(
      <Router history={mockHistory}>
        <div>
          <MockRoute mockAdd={mockAddCategory} mockHide={mockHideCategory} path="/category/:id" />
          <MockRoute mockAdd={mockAddProduct} path="/item/:id" />
        </div>
      </Router>
    );

    mockHistory.applyChange('PUSH', {
      key: 'i123',
      pathname: '/item/123',
    });
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(mockAddCategory).toHaveBeenCalledTimes(1);
    expect(mockAddCategory).toHaveBeenCalledWith(
      {
        key: 'c123',
        pathname: '/category/123',
      },
      { id: '123' },
      undefined
    );
    expect(mockHideCategory).toHaveBeenCalledTimes(1);
    expect(mockHideCategory).toHaveBeenCalledWith(
      {
        key: 'c123',
        pathname: '/category/123',
      },
      { id: '123' },
      undefined
    );
    expect(mockAddProduct).toHaveBeenCalledTimes(1);
    expect(mockAddProduct).toHaveBeenCalledWith(
      {
        immutableKey: 'i123',
        key: 'i123',
        pathname: '/item/123',
      },
      { id: '123' },
      undefined
    );
  });

  it('should notify previous route to destroy', () => {
    const mockHistory = new HistoryStack({
      key: 'c123',
      pathname: '/category/123',
    });
    const mockRemoveItem = jest.fn();

    const wrapper = mount(
      <Router history={mockHistory}>
        <div>
          <MockRoute path="/category/:id" />
          <MockRoute mockAdd={mockRemoveItem} path="/item/:id" />
        </div>
      </Router>
    );

    mockHistory.applyChange('PUSH', {
      key: 'i123',
      pathname: '/item/123',
    });
    mockHistory.applyChange('POP', {
      key: 'c123',
      pathname: '/category/123',
    });
    wrapper.update();

    expect(mockRemoveItem).toHaveBeenCalledTimes(1);
    expect(mockRemoveItem).toHaveBeenCalledWith(
      {
        immutableKey: 'i123',
        key: 'i123',
        pathname: '/item/123',
      },
      { id: '123' },
      undefined
    );
  });
});
