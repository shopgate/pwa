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
} from '@shopgate/engage/cart';
import { MessageBar, CardList, SurroundPortals } from '@shopgate/engage/components';
import { FulfillmentSheet } from '@shopgate/engage/locations';
import { BackBar } from 'Components/AppBar/presets';
import { getPageSettings } from '@shopgate/engage/core/config';
import CouponField from '../CouponField';
import Empty from '../Empty';
import Footer from '../Footer';
import Item from '../Item';
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
      <BackBar title="titles.cart" />
      {(hasItems || hasMessages) && (
        <Fragment>
          {hasMessages && (
            <MessageBar messages={messages} />
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
                        multiLineReservation={flags[FLAG_MULTI_LINE_RESERVE]}
                      >
                        <Item
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
                  <CartItems
                    cartItems={cartItemsSorted}
                    multiLineReservation={flags[FLAG_MULTI_LINE_RESERVE]}
                  >
                    {item => (
                      <Item
                        item={item}
                        key={item.id}
                        onFocus={togglePaymentBar}
                      />
                    )}
                  </CartItems>
                )}
              </SurroundPortals>
              <PaymentBar visible={isPaymentBarVisible} />
            </Fragment>
          )}
          <Footer />
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
  currency: PropTypes.string.isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired,
  cartItems: PropTypes.arrayOf(PropTypes.shape()),
  flags: PropTypes.shape(),
  messages: PropTypes.arrayOf(PropTypes.shape()),
};

CartContent.defaultProps = {
  cartItems: [],
  flags: {},
  messages: [],
};

export default connect(React.memo(CartContent));
