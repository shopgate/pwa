/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import FavoritesButton from 'Components/FavoritesButton';
import AddToCartButton from 'Components/AddToCartButton';
import styles from './style';
import connect from './connector';

/**
 * Handles the add to cart action.
 * @param {Object} props The Component props
 */
const handleAddToCart = ({ productId, addToCart, showVariantModal, isBaseProduct }) => {
  if (isBaseProduct(productId)) {
    showVariantModal();
    return;
  }

  const productData = {
    productId,
    quantity: 1,
  };

  addToCart([productData]);
};

/**
 * Favorites item CTA buttons
 * @param {Object} props The component props.
 * @constructor
 */
const CTAButtons = props => (
  <div className={styles.ctaButtonWrapper}>
    <FavoritesButton
      productId={props.productId}
      active={props.active}
      removeThrottle={props.removeThrottle}
      onRippleComplete={props.onRippleComplete}
      readOnlyOnFetch
    />
    <AddToCartButton
      className={styles.cartButton}
      handleAddToCart={() => handleAddToCart(props)}
      isLoading={false}
      isOrderable={!props.isBaseProduct(props.productId)}
    />
  </div>
);

CTAButtons.propTypes = {
  productId: PropTypes.string.isRequired,
  active: PropTypes.bool,
  addToCart: PropTypes.func,
  isBaseProduct: PropTypes.func,
  onRippleComplete: PropTypes.func,
  removeThrottle: PropTypes.number,
};

CTAButtons.defaultProps = {
  active: null,
  addToCart: () => {},
  isBaseProduct: null,
  onRippleComplete: () => {},
  removeThrottle: null,
};

export default connect(CTAButtons);
