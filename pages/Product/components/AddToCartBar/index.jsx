/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import pure from 'recompose/pure';
import AddToCartButton from './components/AddToCartButton';
import AddMoreButton from './components/AddMoreButton';
import CartItemsCount from './components/CartItemsCount';
import styles from './style';

/**
 * The AddToCartBar component.
 * @return {JSX}
 */
const AddToCartBar = () => [
  <div className={styles.container} key="bar">
    <div className={styles.base}>
      <div className={styles.statusBar}>
        <CartItemsCount />
        <AddMoreButton />
      </div>
      <AddToCartButton />
    </div>
  </div>,
  <div className={styles.dummy} key="dummy" />,
];

export default pure(AddToCartBar);
