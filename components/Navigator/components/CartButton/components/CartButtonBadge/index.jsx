/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import styles from './style';

/**
 * The cart button badge component.
 * Shows the amount of products in the cart.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartButtonBadge = (props) => {
  let productCount = `${props.productCount}`;

  if (props.productCount > CART_MAX_ITEMS) {
    productCount = `${CART_MAX_ITEMS}+`;
  }

  return (
    <div className={styles}>{productCount}</div>
  );
};

CartButtonBadge.propTypes = {
  productCount: PropTypes.number.isRequired,
};

export default CartButtonBadge;
