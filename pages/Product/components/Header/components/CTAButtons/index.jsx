/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import FavoritesButton from 'Components/FavoritesButton';
import AddToCartButton from './components/AddToCartButton';
import styles from './style';
import connect from './connector';

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 *
 * @returns {XML}
 * @constructor
 */
const CTAButtons = ({ isFavorite, productId }) => (
  <div className={styles.buttons}>
    <FavoritesButton
      active={isFavorite}
      productId={productId}
      className={styles.favButton}
      rippleClassName={styles.ripple}
    />
    <AddToCartButton />
  </div>
);

CTAButtons.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  productId: PropTypes.string,
};

CTAButtons.defaultProps = {
  productId: null,
};

export default connect(CTAButtons);
