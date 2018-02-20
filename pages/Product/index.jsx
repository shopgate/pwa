/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
import View from 'Components/View';
import Reviews from 'Components/Reviews';
import TaxDisclaimer from 'Components/TaxDisclaimer';
import ImageSlider from './components/ImageSlider';
import Header from './components/Header';
import VariantSelects from './components/VariantSelects';
import Options from './components/Options';
import Description from './components/Description';
import Properties from './components/Properties';
import connect from './connector';

/**
 * The product component.
 */
class Product extends Component {
  static propTypes = {
    resetCurrentProduct: PropTypes.func.isRequired,
    name: PropTypes.string,
  };

  static defaultProps = {
    name: null,
  };

  /**
   * Component will unmount and reset the current product.
   */
  componentWillUnmount() {
    this.props.resetCurrentProduct();
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <View title={this.props.name}>

        {/* IMAGE */}
        <Portal name={portals.PRODUCT_IMAGE_BEFORE} />
        <Portal name={portals.PRODUCT_IMAGE}>
          <ImageSlider />
        </Portal>
        <Portal name={portals.PRODUCT_IMAGE_AFTER} />

        {/* HEADER */}
        <Portal name={portals.PRODUCT_HEADER_BEFORE} />
        <Portal name={portals.PRODUCT_HEADER}>
          <Header />
        </Portal>
        <Portal name={portals.PRODUCT_HEADER_AFTER} />

        {/* VARIANT SELECT */}
        <Portal name={portals.PRODUCT_VARIANT_SELECT_BEFORE} />
        <Portal name={portals.PRODUCT_VARIANT_SELECT}>
          <VariantSelects />
        </Portal>
        <Portal name={portals.PRODUCT_VARIANT_SELECT_AFTER} />

        {/* OPTIONS */}
        <Portal name={portals.PRODUCT_OPTIONS_BEFORE} />
        <Portal name={portals.PRODUCT_OPTIONS}>
          <Options />
        </Portal>
        <Portal name={portals.PRODUCT_OPTIONS_AFTER} />

        {/* DESCRIPTION */}
        <Portal name={portals.PRODUCT_DESCRIPTION_BEFORE} />
        <Portal name={portals.PRODUCT_DESCRIPTION}>
          <Description />
        </Portal>
        <Portal name={portals.PRODUCT_DESCRIPTION_AFTER} />

        {/* PROPERTIES */}
        <Portal name={portals.PRODUCT_PROPERTIES_BEFORE} />
        <Portal name={portals.PRODUCT_PROPERTIES}>
          <Properties />
        </Portal>
        <Portal name={portals.PRODUCT_PROPERTIES_AFTER} />

        {/* REVIEWS */}
        <Portal name={portals.PRODUCT_REVIEWS_BEFORE} />
        <Portal name={portals.PRODUCT_REVIEWS}>
          <Reviews />
        </Portal>
        <Portal name={portals.PRODUCT_REVIEWS_AFTER} />

        {/* TAX DISCLAIMER */}
        <Portal name={portals.PRODUCT_TAX_DISCLAIMER_BEFORE} />
        <Portal name={portals.PRODUCT_TAX_DISCLAIMER}>
          <TaxDisclaimer />
        </Portal>
        <Portal name={portals.PRODUCT_TAX_DISCLAIMER_AFTER} />
      </View>
    );
  }
}

export default connect(Product);
