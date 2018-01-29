/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      opened: !!props.cartProductCount,
    };
  }

  /**
   * Resets to not open when the count is 0.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      opened: !!nextProps.cartProductCount,
    });
  }

  /**
   * Returns the style.
   * @return {Object} [description]
   */
  get style() {
    if (this.state.opened) {
      return {
        width: '35%',
      };
    }

    return null;
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

    this.setState({
      opened: true,
    });

    openCart();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { cartProductCount } = this.props;
    const style = this.state.opened ? { width: '35%' } : null;

    return (
      <button className={styles} style={style} onClick={this.handleClick}>
        {!cartProductCount ? 'Add to cart' : 'Go to cart'}
      </button>
    );
  }
}

export default connect(AddToCartButton);
