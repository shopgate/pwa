/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  CART_ITEM_TYPE_PRODUCT,
  CART_ITEM_TYPE_COUPON,
} from '@shopgate/pwa-common-commerce/cart/constants';
import Product from './components/Product';
import Coupon from './components/Coupon';

/**
 * The Cart Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ item, togglePaymentBar }) => {
  if (item.type !== CART_ITEM_TYPE_PRODUCT && item.type !== CART_ITEM_TYPE_COUPON) {
    return null;
  }

  if (item.type === CART_ITEM_TYPE_COUPON) {
    return (
      <Coupon
        id={item.id}
        key={item.id}
        coupon={item.coupon}
        messages={item.messages}
      />
    );
  }

  return (
    <Product
      id={item.id}
      key={item.id}
      product={item.product}
      quantity={item.quantity}
      messages={item.messages}
      onToggleFocus={togglePaymentBar}
    />
  );
};

Item.propTypes = {
  item: PropTypes.shape().isRequired,
  togglePaymentBar: PropTypes.func.isRequired,
};

export default Item;
