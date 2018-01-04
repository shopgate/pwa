/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import ProductGrid from 'Components/ProductGrid';
import Products from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<Products>', () => {
  const props = {
    handleGetProducts: () => {},
    products: [],
  };

  it('should render the grid', () => {
    const wrapper = mount(<Products {...props} />);
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductGrid).length).toEqual(1);
  });
});
