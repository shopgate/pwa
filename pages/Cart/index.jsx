/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import CardList from 'Components/CardList';
import MessageBar from 'Components/MessageBar';
import TaxDisclaimer from 'Components/TaxDisclaimer';
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
    isLoading: PropTypes.bool.isRequired,
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
      containerPaddingStyle: styles.getContainerPaddingStyle(),
    };
  }

  /**
   * Callback for the onSize event of the PaymentBar.
   * @param {Object} size An object which contains data about the current componenent dimensions.
   */
  onSize = ({ height }) => {
    this.setState({
      containerPaddingStyle: styles.getContainerPaddingStyle(height),
    });
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
    const { cartItems, isLoading, messages } = this.props;
    const hasItems = cartItems.length > 0;
    const hasMessages = messages.length > 0;

    return (
      <View title={this.title}>
        {(hasItems || hasMessages) && (
          <section
            className={styles.container}
            style={this.state.containerPaddingStyle}
          >
            {hasMessages && <MessageBar messages={messages} />}
            {hasItems && (
              <Fragment>
                <CardList>
                  {cartItems.map(cartItem => (
                    <Item
                      key={cartItem.id}
                      item={cartItem}
                      togglePaymentBar={this.togglePaymentBar}
                    />
                  ))}
                  <CouponField onToggleFocus={this.togglePaymentBar} />
                </CardList>
                <PaymentBar
                  isVisible={!this.state.isPaymentBarHidden}
                  onSize={this.onSize}
                />
              </Fragment>
            )}
            {(!isLoading && hasItems) && <TaxDisclaimer />}
          </section>
        )}
        {(!isLoading && !hasItems) && <Empty />}
      </View>
    );
  }
}

export default connect(Cart);
