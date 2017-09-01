/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import CardList from 'Components/CardList';
import MessageBar from 'Components/MessageBar';
import Item from './components/Item';
import CouponField from './components/CouponField';
import Empty from './components/Empty';
import PaymentBar from './components/PaymentBar';
import connect from './connector';
import styles from './style';

/**
 * The cart view component.
 * @returns {JSX}
 */
class Cart extends Component {
  static propTypes = {
    cartItems: PropTypes.arrayOf(PropTypes.shape()),
    messages: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    cartItems: [],
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
   * It's called when the QuantityPicker or CouponField is focused or blurred.
   * @param {boolean} isHidden Tells if the payment bar is hidden or not.
   */
  togglePaymentBar = (isHidden) => {
    this.setState({
      isPaymentBarHidden: isHidden,
    });
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { cartItems, messages } = this.props;

    return (
      <View title={this.title}>
        {messages.length > 0 && <MessageBar messages={messages} />}
        {cartItems.length > 0 && (
          <section className={styles.container}>
            <CardList>
              {cartItems.map(cartItem => (
                <Item item={cartItem} togglePaymentBar={this.togglePaymentBar} />
              ))}
              <CouponField onToggleFocus={this.togglePaymentBar} />
            </CardList>
            <PaymentBar isVisible={!this.state.isPaymentBarHidden} />
          </section>
        )}
        {cartItems.length === 0 && <Empty />}
      </View>
    );
  }
}

export default connect(Cart);
