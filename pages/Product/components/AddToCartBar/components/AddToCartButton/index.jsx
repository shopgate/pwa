/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartButton component.
 */
class AddToCartButton extends Component {
  static propTypes = {
    handleAddToCart: PropTypes.func.isRequired,
    itemCount: PropTypes.number.isRequired,
    openCart: PropTypes.func.isRequired,
  }

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      opened: !!props.itemCount,
    };
  }

  /**
   * Resets to not open when the count is 0.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      opened: !!nextProps.itemCount,
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
    const { itemCount, handleAddToCart, openCart } = this.props;

    if (!itemCount) {
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
    const { itemCount } = this.props;
    const style = this.state.opened ? { width: '40%' } : null;

    return (
      <button className={styles} style={style} onClick={this.handleClick}>
        {!itemCount ? (
          <I18n.Text string="product.add_to_cart" />
        ) : (
          <I18n.Text string="product.go_to_cart" />
        )}
      </button>
    );
  }
}

export default connect(AddToCartButton);
