import { hot } from 'react-hot-loader/root';
import React from 'react';
import { CardList, ResponsiveContainer } from '@shopgate/engage/components';
import { FulfillmentSlotSwitcher } from '@shopgate/engage/locations';
import PropTypes from 'prop-types';
import CartItemsHeaderWide from './CartItemsHeaderWide';
import { CartItemProvider, CartItem } from '../CartItem';
import { CartItemCard } from './CartItemCard';
import { items, card } from './CartItems.style';
import CartItemsSubstitution from './CartItemsSubstitution';

/**
 * @typedef {import('../../../cart/cart.types').Item} Item
 */

/**
 * Renders the cart items.
 * @param {Object} props The component props.
 * @param {Item} [props.cartItems] The cart items.
 * @param {boolean} [props.multiLineReservation] Whether multi-line reservation is enabled.
 * @param {Function} props.onFocus The focus handler.
 * @param {boolean} [props.editable] Whether the cart is editable.
 * @param {boolean} [props.isOrderDetails] Whether this is for order details.
 * @param {boolean} [props.isDirectShipOnly] Whether the cart is direct-ship only.
 * @param {boolean} [props.isCheckoutConfirmation] Whether this is for checkout confirmation.
 * @param {string} [props.currencyOverride] The currency override.
 * @returns {JSX.Element|null}
 */
const CartItems = ({
  cartItems,
  onFocus,
  multiLineReservation,
  editable,
  isOrderDetails,
  isCheckoutConfirmation,
  currencyOverride,
  isDirectShipOnly,
}) => {
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <ResponsiveContainer breakpoint=">xs" webOnly>
        <CartItemsHeaderWide
          editable={editable}
          isOrderDetails={isOrderDetails}
          isDirectShipOnly={isDirectShipOnly}
          isCheckoutConfirmation={isCheckoutConfirmation}
        />
      </ResponsiveContainer>

      <CardList className={items}>
        {!isOrderDetails ? (
          <ResponsiveContainer appAlways breakpoint="<=xs">
            <FulfillmentSlotSwitcher renderBar card editable={editable} />
          </ResponsiveContainer>
        ) : null}
        {editable && !isDirectShipOnly && (
          <ResponsiveContainer breakpoint="<=xs" appAlways>
            <CartItemsSubstitution cartItems={cartItems} wrapCard className={card} />
          </ResponsiveContainer>
        )}
        {cartItems.map(item => (
          <CardList.Item className={card} key={item.id}>
            <CartItemProvider
              cartItem={item}
              isEditable={editable}
              isOrderDetails={isOrderDetails}
              cartIsDirectShipOnly={isDirectShipOnly}
              isCheckoutConfirmation={isCheckoutConfirmation}
              locationId={item.fulfillmentLocationId}
            >
              <ul>
                <CartItemCard
                  multiLineReservation={multiLineReservation}
                  fulfillmentLocationId={item.fulfillmentLocationId}
                  fulfillmentMethod={item.fulfillmentMethod}
                  hasMessages={Array.isArray(item.messages) && item.messages.length > 0}
                >
                  <CartItem
                    item={item}
                    onFocus={onFocus}
                    editable={editable}
                    currencyOverride={currencyOverride}
                  />
                </CartItemCard>
              </ul>
            </CartItemProvider>
          </CardList.Item>
        ))}
      </CardList>
    </>
  );
};

CartItems.propTypes = {
  onFocus: PropTypes.func.isRequired,
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fulfillmentLocationId: PropTypes.string,
      fulfillmentMethod: PropTypes.string,
      messages: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  currencyOverride: PropTypes.string,
  editable: PropTypes.bool,
  isCheckoutConfirmation: PropTypes.bool,
  isDirectShipOnly: PropTypes.bool,
  isOrderDetails: PropTypes.bool,
  multiLineReservation: PropTypes.bool,
};

CartItems.defaultProps = {
  cartItems: null,
  multiLineReservation: null,
  editable: true,
  isOrderDetails: false,
  isDirectShipOnly: false,
  isCheckoutConfirmation: false,
  currencyOverride: null,
};

export default hot(CartItems);
