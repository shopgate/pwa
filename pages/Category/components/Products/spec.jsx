/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import ProductGrid from 'Components/ProductGrid';
import ProductList from 'Components/ProductList';
import { GRID_VIEW, LIST_VIEW } from 'Pages/Category/constants';
import Products from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe.skip('<Products>', () => {
  const dummyProps = {
    handleGetProducts: () => {},
    products: [],
  };

  it('should hide list view in grid view mode', () => {
    const Component = (
      <Products viewMode={GRID_VIEW} {...dummyProps} />
    );
    const wrapper = mount(Component);
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductGrid).length).toEqual(1);
    expect(wrapper.find(ProductGrid).at(0).parent().get(0).style.display).toEqual('block');
    expect(wrapper.find(ProductList).length).toEqual(1);
    expect(wrapper.find(ProductList).at(0).parent().get(0).style.display).toEqual('none');
  });

  it('should hide grid view in list view mode', () => {
    const Component = (
      <Products viewMode={LIST_VIEW} {...dummyProps} />
    );
    const wrapper = mount(Component);
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductGrid).length).toEqual(1);
    expect(wrapper.find(ProductGrid).at(0).parent().get(0).style.display).toEqual('none');
    expect(wrapper.find(ProductList).length).toEqual(1);
    expect(wrapper.find(ProductList).at(0).parent().get(0).style.display).toEqual('block');
  });
});
