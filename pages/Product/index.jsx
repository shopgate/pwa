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
import connect from './connector';

/**
 * The product component.
 */
class Product extends Component {
  static propTypes = {
    getProductData: PropTypes.func.isRequired,
    resetCurrentProduct: PropTypes.func.isRequired,
    setProductOption: PropTypes.func.isRequired,
    currentOptions: PropTypes.shape(),
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    openGallery: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape()),
    product: PropTypes.shape(),
    properties: PropTypes.arrayOf(PropTypes.shape()),
    shipping: PropTypes.shape({
      price: PropTypes.number,
      currency: PropTypes.string,
    }),
    variants: PropTypes.shape({
      products: PropTypes.array.isRequired,
      characteristics: PropTypes.array.isRequired,
    }),
  };

  static defaultProps = {
    currentOptions: {},
    description: null,
    images: null,
    product: null,
    properties: null,
    variants: null,
    shipping: null,
    options: null,
    openGallery: () => {},
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
    const title = this.props.product ? this.props.product.name : '';

    return (
      <View>
        <ViewContent title={title}>
          <ImageSlider />
        </ViewContent>
      </View>
    );
  }
}

export default connect.product(Product);
