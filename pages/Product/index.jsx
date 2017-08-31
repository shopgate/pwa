/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import ViewContent from 'Components/ViewContent';
import ImageSlider from './components/ImageSlider';
import Header from './components/Header';
import connect from './connector';

/**
 * The product component.
 */
class Product extends Component {
  static propTypes = {
    getProductData: PropTypes.func.isRequired,
    resetCurrentProduct: PropTypes.func.isRequired,
    name: PropTypes.string,
  };

  static defaultProps = {
    name: null,
  };

  /**
   * Fetch the product data, but only if it was not by ProductVariants.
   */
  componentDidMount() {
    this.ensureGetProductData(null, true);
  }

  /**
   * Component will unmount and reset the current product.
   */
  componentWillUnmount() {
    this.props.resetCurrentProduct();
  }

  /**
   *
   * @param {string} selectedVariantId The selected variant ID.
   * @param {boolean} [callOnlyIfNeverCalled=false] Call getProductData only if it was never called.
   */
  ensureGetProductData = (selectedVariantId, callOnlyIfNeverCalled = false) => {
    if (!callOnlyIfNeverCalled || !this.wasCalled) {
      this.wasCalled = true;
      this.props.getProductData(selectedVariantId);
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <View>
        <ViewContent title={(this.props.name || '')}>
          <ImageSlider />
          <Header />
        </ViewContent>
      </View>
    );
  }
}

export default connect(Product);
