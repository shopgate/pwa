/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CART_ITEM_TYPE_PRODUCT,
  CART_ITEM_TYPE_COUPON,
} from '@shopgate/pwa-common-commerce/cart/constants';
import View from 'Components/View';
import ViewContent from 'Components/ViewContent';
import CardList from 'Components/CardList';
import {
  CartEmpty,
  CartPaymentBar,
  MessageBar,
} from 'Templates/components';
import CartProduct from './components/product';
import CartCoupon from './components/coupon';
import CartCouponField from './components/coupon-field';
import connect from './connectors';
import styles from './style';

/**
 * The cart view component.
 * @returns {JSX}
 */
class Cart extends Component {
  static propTypes = {
    goBackHistory: PropTypes.func.isRequired,
    cartItems: PropTypes.arrayOf(PropTypes.shape()),
    currency: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    cartItems: [],
    currency: 'USD',
    messages: [],
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      isPaymentBarHidden: false,
    };
  }

  /**
   * Returns the translated view title.
   * @return {string}
   */
  get title() {
    const { __ } = this.context.i18n();
    return __('titles.cart');
  }

  /**
   * Toggles the visibility of the payment bar.
   * It's called when the QuantityPicker or CartCouponField is focused or blurred.
   * @param {boolean} isHidden Tells if the payment bar is hidden or not.
   */
  togglePaymentBar = (isHidden) => {
    this.setState({
      isPaymentBarHidden: isHidden,
    });
  };

  /**
   * Renders a single cart item component.
   * @param {Object} cartItem The data of the cart item.
   * @return {JSX}
   */
  renderCartItem(cartItem) {
    if (cartItem.type === CART_ITEM_TYPE_PRODUCT) {
      return (
        <CartProduct
          currency={this.props.currency}
          id={cartItem.id}
          key={cartItem.id}
          product={cartItem.product}
          quantity={cartItem.quantity}
          onToggleFocus={this.togglePaymentBar}
        />
      );
    } else if (cartItem.type === CART_ITEM_TYPE_COUPON) {
      return (
        <CartCoupon
          currency={this.props.currency}
          id={cartItem.id}
          key={cartItem.id}
          coupon={cartItem.coupon}
        />
      );
    }

    return null;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const hasCartItems = this.props.cartItems.length > 0;

    return (
      <View>
        <ViewContent title={this.title}>
          { this.props.messages.length > 0 &&
            <MessageBar messages={this.props.messages} />
          }

          { hasCartItems &&
            <section className={styles.container}>
              <CardList>
                { this.props.cartItems.map(cartItem =>
                  this.renderCartItem(cartItem)
                )}
                <CartCouponField onToggleFocus={this.togglePaymentBar} />
              </CardList>
              <CartPaymentBar isVisible={!this.state.isPaymentBarHidden} />
            </section>
          }

          { !hasCartItems &&
            <CartEmpty goBackHistory={this.props.goBackHistory} />
          }
        </ViewContent>
      </View>
    );
  }
}

export default connect(Cart);
