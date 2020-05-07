import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import {
  getCartConfig,
  sortCartItems,
  CART_PATH,
  CART_ITEM_LIST,
  CART_COUPON_FIELD,
  PaymentBar,
  CartContext,
  FLAG_MULTI_LINE_RESERVE,
  CartItemGroup,
  CartItems,
  CartItem,
  CartHeaderWide,
  CartSummaryWide,
} from '@shopgate/engage/cart';
import {
  MessageBar,
  CardList,
  SurroundPortals,
  ResponsiveContainer,
} from '@shopgate/engage/components';
import { FulfillmentSheet } from '@shopgate/engage/locations';
import { SimpleBar } from 'Components/AppBar/presets';
import { getPageSettings } from '@shopgate/engage/core/config';
import CouponField from '../CouponField';
import Empty from '../Empty';
import Footer from '../Footer';
import connect from './connector';
import styles from './style';

const config = getCartConfig();

/**
 * The cart content container component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartContent(props) {
  const {
    cartItems, messages, isUserLoggedIn, currency, flags,
  } = props;
  const [isPaymentBarVisible, setIsPaymentBarVisible] = React.useState(true);
  const { isLoading: getIsLoading } = React.useContext(LoadingContext);

  const isLoading = getIsLoading(CART_PATH);
  const hasItems = (cartItems.length > 0);
  const hasMessages = (messages.length > 0);
  const cartItemsSorted = sortCartItems(cartItems);
  const { cartItemsDisplay = 'line' } = getPageSettings(CART_PATH);

  /**
   * Toggles the visibility of the payment bar.
   * It's called when the QuantityPicker or CouponField is focused or blurred.
   * @param {boolean} isHidden Tells if the payment bar is hidden or not.
   */
  function togglePaymentBar(isHidden) {
    setIsPaymentBarVisible(!isHidden);
  }

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
      { hasItems && (
        <ResponsiveContainer webOnly breakpoint=">xs">
          <CartHeaderWide />
        </ResponsiveContainer>
      )}
      {(hasItems || hasMessages) && (
        <Fragment>
          {hasMessages && (
            <MessageBar messages={messages} raised={cartItemsDisplay === 'card'} />
          )}
          {hasItems && (
            <Fragment>
              <SurroundPortals portalName={CART_ITEM_LIST}>
                {(cartItemsDisplay === 'line') && (
                  <CardList className={styles}>
                    {cartItemsSorted.map(cartItem => (
                      <CartItemGroup
                        key={cartItem.id}
                        fulfillmentLocationId={cartItem.fulfillmentLocationId}
                        fulfillmentMethod={cartItem.fulfillmentMethod}
                        multiLineReservation={flags[FLAG_MULTI_LINE_RESERVE]}
                      >
                        <CartItem
                          item={cartItem}
                          key={cartItem.id}
                          onFocus={togglePaymentBar}
                        />
                      </CartItemGroup>
                    ))}
                    <SurroundPortals portalName={CART_COUPON_FIELD}>
                      <CouponField onFocus={togglePaymentBar} />
                    </SurroundPortals>
                  </CardList>
                )}
                {(cartItemsDisplay === 'card') && (
                  <Fragment>
                    <CartItems
                      cartItems={cartItemsSorted}
                      multiLineReservation={flags[FLAG_MULTI_LINE_RESERVE]}
                      onFocus={togglePaymentBar}
                    />
                    <SurroundPortals portalName={CART_COUPON_FIELD}>
                      <CouponField onFocus={togglePaymentBar} />
                    </SurroundPortals>
                  </Fragment>
                )}
              </SurroundPortals>
              <ResponsiveContainer appAlways breakpoint="<=xs">
                <PaymentBar visible={isPaymentBarVisible} />
              </ResponsiveContainer>
              <ResponsiveContainer webOnly breakpoint=">xs">
                <CartSummaryWide />
              </ResponsiveContainer>
            </Fragment>
          )}
          <ResponsiveContainer breakpoint="<=xs">
            <Footer />
          </ResponsiveContainer>
        </Fragment>
      )}
      {(!isLoading && !hasItems) && (
        <Empty />
      )}
      <FulfillmentSheet />
    </CartContext.Provider>
  );
}

CartContent.propTypes = {
  isUserLoggedIn: PropTypes.bool.isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape()),
  currency: PropTypes.string,
  flags: PropTypes.shape(),
  messages: PropTypes.arrayOf(PropTypes.shape()),
};

CartContent.defaultProps = {
  currency: null,
  cartItems: [],
  flags: {},
  messages: [],
};

export default connect(React.memo(CartContent));
