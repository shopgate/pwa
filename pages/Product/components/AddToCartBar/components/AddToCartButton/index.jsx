/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@shopgate/pwa-common/components/Button';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartButton component.
 */
class AddToCartButton extends Component {
  static propTypes = {
    cartProductCount: PropTypes.number.isRequired,
    handleAddToCart: PropTypes.func.isRequired,
    openCart: PropTypes.func.isRequired,
  }
  /**
   * Adds a new product to cart or opens the cart if it already has products in it.
   */
  handleClick = () => {
    const { cartProductCount, handleAddToCart, openCart } = this.props;

    if (!cartProductCount) {
      handleAddToCart();
      return;
    }

    openCart();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { cartProductCount } = this.props;

    return (
      <Button className={styles} onClick={this.handleClick}>
        {!cartProductCount ? 'Add to cart' : 'Go to cart'}
      </Button>
    );
  }
}

export default connect(AddToCartButton);
