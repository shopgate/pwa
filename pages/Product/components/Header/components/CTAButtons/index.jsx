/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
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
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 *
 * @param {Object} props Props.
 * @returns {JSX}
 * @constructor
 */
const CTAButtons = props => (
  <div className={styles.buttons}>
    <FavoritesButton
      active={props.isFavorite}
      productId={props.productId}
      className={styles.favButton}
      rippleClassName={styles.ripple}
    />
    <AddToCartButton
      isLoading={props.isLoading}
      isOrderable={props.isOrderable}
      handleAddToCart={props.handleAddToCart}
      buttonSize={styles.cartButtonSize}
      iconSize={styles.iconSize}
      className={styles.cartButton}
    />
  </div>
);

CTAButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  handleAddToCart: PropTypes.func,
  isLoading: PropTypes.bool,
  isOrderable: PropTypes.bool,
  productId: PropTypes.string,
};

CTAButtons.defaultProps = {
  handleAddToCart: () => {},
  isLoading: null,
  isOrderable: null,
  productId: null,
};

export default connect(CTAButtons);
