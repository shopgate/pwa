/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import AddToCartButton from './components/AddToCartButton';
import Rating from './components/Rating';
import Name from './components/Name';
import styles from './style';

/**
 * The product header component that displays textual information
 * - manufacturer
 * - shipping
 * - discount
 * - price
 * - price info
 * If not available or animating it will display placeholders
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductHeader = (props) => {
  // If we don't have data yet OR if the view is currently animating show placeholder only
  const placeholderProductReady = (!props.isAnimating && (props.product !== null));

  /**
   * Required to display placeholders.
   * If we don't have the product we don't know if it has discount, manufacturer, etc.
   * this object will decide what placeholders are visible
   * @type {Object}
   */
  const defaultData = {
    // White space because empty string is false. Needed to show placeholder.
    manufacturer: ' ',
    price: {},
    availability: {
      // White space because empty string is false. Needed to show placeholder.
      text: ' ',
    },
  };
  const product = (placeholderProductReady && props.product) ? props.product : defaultData;

  /**
   * Identical logic for shipping, like for the product. The data is requested with a separate
   * pipeline request, so it's placeholder needs separate handling.
   * @type {boolean}
   */
  const placeholderShippingReady = (!props.isAnimating && (props.shipping !== null));

  return (
    <div className={styles.content}>
      <AddToCartButton />
      <Rating />
      <Name />
    </div>
  );
};

ProductHeader.propTypes = {
  product: PropTypes.shape(),
  shipping: PropTypes.shape({
    currency: PropTypes.string,
    price: PropTypes.number,
  }),
};

ProductHeader.defaultProps = {
  product: null,
  shipping: {},
};

export default ProductHeader;
