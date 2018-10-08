import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import CardList from '@shopgate/pwa-ui-shared/CardList';
import MessageBar from '@shopgate/pwa-ui-shared/MessageBar';
import { SimpleBar } from 'Components/AppBar/presets';
import Item from '../Item';
import CouponField from '../CouponField';
import Empty from '../Empty';
import Footer from '../Footer';
import PaymentBar from '../PaymentBar';
import connect from './connector';
import styles from './style';

/**
 * The CartContent component.
 */
class CartContent extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    cartItems: PropTypes.arrayOf(PropTypes.shape()),
    messages: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    cartItems: [],
    messages: [],
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      isPaymentBarVisible: true,
    };
  }

  /**
   * @returns {boolean}
   */
  get hasItems() {
    return this.props.cartItems.length > 0;
  }

  /**
   * @returns {boolean}
   */
  get hasMessages() {
    return this.props.messages.length > 0;
  }

  /**
   * Toggles the visibility of the payment bar.
   * It's called when the QuantityPicker or CouponField is focused or blurred.
   * @param {boolean} isHidden Tells if the payment bar is hidden or not.
   */
  togglePaymentBar = (isHidden) => {
    this.setState({
      isPaymentBarVisible: !isHidden,
    });
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { cartItems, isLoading, messages } = this.props;
    const { isPaymentBarVisible } = this.state;

    return (
      <Fragment>
        <SimpleBar title="titles.cart" />
        {(this.hasItems || this.hasMessages) && (
          <Fragment>
            {this.hasMessages && <MessageBar messages={messages} />}
            {this.hasItems && (
              <Fragment>
                <Portal name={portals.CART_ITEM_LIST_BEFORE} />
                <Portal name={portals.CART_ITEM_LIST}>
                  <CardList className={styles}>
                    {cartItems.map(cartItem => (
                      <Item
                        item={cartItem}
                        key={cartItem.id}
                        onFocus={this.togglePaymentBar}
                      />
                    ))}
                    <Portal name={portals.CART_COUPON_FIELD_BEFORE} />
                    <Portal name={portals.CART_COUPON_FIELD} >
                      <CouponField onFocus={this.togglePaymentBar} />
                    </Portal>
                    <Portal name={portals.CART_COUPON_FIELD_AFTER} />
                  </CardList>
                </Portal>
                <Portal name={portals.CART_ITEM_LIST_AFTER} />
                <PaymentBar visible={isPaymentBarVisible} />
              </Fragment>
            )}
            <Footer />
          </Fragment>
        )}
        {(!isLoading && !this.hasItems) && <Empty />}
      </Fragment>
    );
  }
}

export default connect(CartContent);
