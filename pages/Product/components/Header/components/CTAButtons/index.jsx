/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import FavoritesButton from 'Components/FavoritesButton';
import AddToCartButton from './components/AddToCartButton';
import styles from './style';

/**
 * Renders CTA buttons for product page (add to cart + toggle favorites).
 *
 * @returns {XML}
 * @constructor
 */
const CTAButtons = () => (
  <div className={styles.buttons}>
    <FavoritesButton
      className={styles.favButton}
      rippleClassName={styles.ripple}
    />
    <AddToCartButton />
  </div>
);

export default CTAButtons;
