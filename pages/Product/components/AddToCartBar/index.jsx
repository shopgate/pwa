/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddToCartButton from './components/AddToCartButton';
import AddMoreButton from './components/AddMoreButton';
import CartItemsCount from './components/CartItemsCount';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartBar component.
 */
class AddToCartBar extends Component {
  static propTypes = {
    cartProductCount: PropTypes.number.isRequired,
    handleAddToCart: PropTypes.func.isRequired,
  };

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.state = {
      itemCount: 0,
    };
  }

  /**
   * Resets the item count if the cart is emptied.
   * @param {Object} nextProps The next props.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.cartProductCount === 0) {
      this.setState({
        itemCount: 0,
      });
    }
  }

  /**
   * Prevents from unnecessary component updates.
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.itemCount !== nextState.itemCount);
  }

  handleAddToCart = () => {
    this.props.handleAddToCart();

    this.setState({
      itemCount: this.state.itemCount + 1,
    });
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { itemCount } = this.state;

    return [
      <div className={styles.container} key="bar">
        <div className={styles.base}>
          <div className={styles.statusBar}>
            <CartItemsCount itemCount={itemCount} />
            <AddMoreButton handleAddToCart={this.handleAddToCart} />
          </div>
          <AddToCartButton itemCount={itemCount} handleAddToCart={this.handleAddToCart} />
        </div>
      </div>,
      <div className={styles.dummy} key="dummy" />,
    ];
  }
}

export default connect(AddToCartBar);
