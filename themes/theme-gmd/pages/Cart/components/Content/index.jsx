import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import {
  getCartConfig,
  groupCartItems,
  CART_PATH,
  CART_ITEM_LIST,
  CART_COUPON_FIELD,
  PaymentBar,
  CartContext,
} from '@shopgate/engage/cart';
import { MessageBar, CardList, SurroundPortals } from '@shopgate/engage/components';
import { FulfillmentSheet } from '@shopgate/engage/locations';
import { SimpleBar } from 'Components/AppBar/presets';
import ItemsGroup from '../ItemsGroup';
import CouponField from '../CouponField';
import Empty from '../Empty';
import Footer from '../Footer';
import connect from './connector';
import styles from './style';

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

    const contextValue = {
      currency,
      config,
      isUserLoggedIn,
      isLoading,
      flags,
    };

    return (
      <CartContext.Provider value={contextValue}>
        <SimpleBar title="titles.cart" />
        {(hasItems || hasMessages) && (
          <Fragment>
            {hasMessages && <MessageBar messages={messages} />}
            {hasItems && (
              <Fragment>
                <SurroundPortals portalName={CART_ITEM_LIST}>
                  <CardList className={styles}>
                    {Object.keys(cartItemGroups).map(groupKey => (
                      <ItemsGroup
                        key={groupKey}
                        items={cartItemGroups[groupKey].items}
                        fulfillmentLocationId={cartItemGroups[groupKey].fulfillmentLocationId}
                        onFocus={this.togglePaymentBar}
                      />
                    ))}
                    <SurroundPortals portalName={CART_COUPON_FIELD}>
                      <CouponField onFocus={this.togglePaymentBar} />
                    </SurroundPortals>
                  </CardList>
                </SurroundPortals>
                <PaymentBar visible={isPaymentBarVisible} />
              </Fragment>
            )}
            <Footer />
          </Fragment>
        )}
        {(!isLoading && !hasItems) && <Empty />}
        <FulfillmentSheet />
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
