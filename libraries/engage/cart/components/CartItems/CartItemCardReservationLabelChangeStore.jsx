import React, { useCallback } from 'react';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { button, ripple } from './CartItemCardReservationLabelChangeStore.style';
import { useCartItem } from '../CartItem';

/**
 * @returns {JSX}
 */
const CartItemCardReservationLabelChangeStore = () => {
  const { invokeFulfillmentAction, cartItem } = useCartItem();

  const handleChangeLocationClick = useCallback(() => {
    if (!cartItem || !cartItem.fulfillment || !cartItem.fulfillment.method) {
      return;
    }

    const { fulfillment: { method } } = cartItem;

    invokeFulfillmentAction('changeLocation', method);
  }, [cartItem, invokeFulfillmentAction]);

  return (
    <RippleButton
      onClick={handleChangeLocationClick}
      className={button}
      rippleClassName={ripple}
      type="secondary"
      flat
    >
      <I18n.Text string="locations.change_location" />
    </RippleButton>
  );
};

export default CartItemCardReservationLabelChangeStore;
