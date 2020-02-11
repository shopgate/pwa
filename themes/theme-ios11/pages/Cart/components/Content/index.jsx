import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import {
  getCartConfig,
  groupCartItems,
  CART_PATH,
  CART_ITEM_LIST_BEFORE,
  CART_ITEM_LIST,
  CART_COUPON_FIELD_BEFORE,
  CART_COUPON_FIELD,
  CART_COUPON_FIELD_AFTER,
  CART_ITEM_LIST_AFTER,
} from '@shopgate/engage/cart';
import { MessageBar, CardList, Portal } from '@shopgate/engage/components';
import { BackBar } from 'Components/AppBar/presets';
import ItemsGroup from '../ItemsGroup';
import CouponField from '../CouponField';
import Empty from '../Empty';
import Footer from '../Footer';
import PaymentBar from '../PaymentBar';
import connect from './connector';
import styles from './style';
import CartContext from '../../context';

const config = getCartConfig();

/**
 * The cart content container component.
 */
class CartContentContainer extends PureComponent {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isUserLoggedIn: PropTypes.bool.isRequired,
    cartItems: PropTypes.arrayOf(PropTypes.shape()),
    flags: PropTypes.shape(),
    messages: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    cartItems: [],
    flags: {},
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
    const {
      cartItems, isLoading, messages, isUserLoggedIn, currency, flags,
    } = this.props;
    const { isPaymentBarVisible } = this.state;
    const hasItems = (cartItems.length > 0);
    const hasMessages = (messages.length > 0);

    const cartItemGroups = groupCartItems(cartItems);
    return (
      <CartContext.Provider value={{
        currency,
        config,
        isUserLoggedIn,
        isLoading,
        flags,
      }}
      >
        <BackBar title="titles.cart" />
        {(hasItems || hasMessages) && (
          <Fragment>
            {hasMessages && <MessageBar messages={messages} />}
            {hasItems && (
              <Fragment>
                <Portal name={CART_ITEM_LIST_BEFORE} />
                <Portal name={CART_ITEM_LIST}>
                  <CardList className={styles}>
                    {Object.keys(cartItemGroups).map(groupKey => (
                      <ItemsGroup
                        key={groupKey}
                        items={cartItemGroups[groupKey].items}
                        group={cartItemGroups[groupKey].group}
                        onFocus={this.togglePaymentBar}
                      />
                    ))}
                    <Portal name={CART_COUPON_FIELD_BEFORE} />
                    <Portal name={CART_COUPON_FIELD}>
                      <CouponField onFocus={this.togglePaymentBar} />
                    </Portal>
                    <Portal name={CART_COUPON_FIELD_AFTER} />
                  </CardList>
                </Portal>
                <Portal name={CART_ITEM_LIST_AFTER} />
                <PaymentBar visible={isPaymentBarVisible} />
              </Fragment>
            )}
            <Footer />
          </Fragment>
        )}
        {(!isLoading && !hasItems) && <Empty />}
      </CartContext.Provider>
    );
  }
}

/**
 * The cart content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function CartContent(props) {
  return (
    <LoadingContext.Consumer>
      {({ isLoading }) => <CartContentContainer {...props} isLoading={isLoading(CART_PATH)} />}
    </LoadingContext.Consumer>
  );
}

export default connect(CartContent);
