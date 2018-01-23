/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import ProductGrid from 'Components/ProductGrid';
import ProductList from 'Components/ProductList';
import { Unwrapped as ProductsWidget } from './index';

describe.skip('<ProductsWidget />', () => {
  const props = {
    id: 'someid',
    products: [],
    totalProductCount: null,
    settings: {
      headline: '',
      layout: 'grid',
      productLimit: 6,
      queryParams: 'Blue',
      queryType: 2,
    },
  };

  it('should render the grid only when products are received', () => {
    const wrapper = shallow(
      <ProductsWidget {...props} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductGrid).length).toBe(0);

    // Now give it a product...
    wrapper.setProps({
      products: [{}],
      totalProductCount: 1,
    });

    expect(wrapper.find(ProductGrid).length).toBe(1);
  });

  it('should render the products in the list view', () => {
    const wrapper = shallow(
      <ProductsWidget {...props} />
    );

    // Change the layout to a list.
    wrapper.setProps({
      products: [{}],
      settings: {
        headline: '',
        layout: 'list',
      },
      totalProductCount: 1,
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductList).length).toBe(1);
  });
});
