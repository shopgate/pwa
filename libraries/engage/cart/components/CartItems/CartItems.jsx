// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { CardList, ResponsiveContainer } from '@shopgate/engage/components';
import { FulfillmentSlotSwitcher } from '@shopgate/engage/locations';
import { type Item } from '../../cart.types';
import CartItemsHeaderWide from './CartItemsHeaderWide';
import { CartItemProvider, CartItem } from '../CartItem';
import { CartItemCard } from './CartItemCard';
import { items, card } from './CartItems.style';
import CartItemsSubstitution from './CartItemsSubstitution';

type Props = {
  cartItems?: Item[],
  multiLineReservation?: boolean,
  onFocus: (hidden: boolean) => void,
  editable?: boolean,
  isOrderDetails?: boolean,
  isDirectShipOnly?: boolean,
  isCheckoutConfirmation?: boolean,
  currencyOverride?: string,
}

/**
 * Renders the cart items.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartItems({
  cartItems,
  onFocus,
  multiLineReservation,
  editable,
  isOrderDetails,
  isCheckoutConfirmation,
  currencyOverride,
  isDirectShipOnly,
}: Props) {
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

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
