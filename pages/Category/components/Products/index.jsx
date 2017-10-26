/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductGrid from 'Components/ProductGrid';
import connect from './connector';

/**
 * The Products component
 * This components optimizes the switching between grid and list view by rendering both
 * all the time and then only switching the inline style directly in the real DOM.
 */
class Products extends Component {
  static propTypes = {
    getProducts: PropTypes.func,
    products: PropTypes.arrayOf(PropTypes.shape()),
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    getProducts: () => {},
    products: null,
    totalProductCount: null,
  };

  /**
   * Renders the Products component.
   * @returns {JSX}
   */
  render() {
    if (!this.props.products) {
      return null;
    }

    return (
      <ProductGrid
        handleGetProducts={this.props.getProducts}
        products={this.props.products}
        totalProductCount={this.props.totalProductCount}
      />
    );
  }
}

export default connect(Products);
