/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import FavoritesButton from 'Components/FavoritesButton';
import AddToCartButton from './components/AddToCartButton';
import styles from './style';

const CTAButtons = () => {
  return (
    <div className={styles.buttons}>
      <FavoritesButton
        className={styles.favButton}
        rippleClassName={styles.ripple}
      />
      <AddToCartButton />
    </div>
  );
};

export default CTAButtons;
