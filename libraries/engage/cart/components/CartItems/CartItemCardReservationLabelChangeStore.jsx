import React, { useCallback } from 'react';
import { I18n } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
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
    <Button
      variant="link"
      color="primary"
      onClick={handleChangeLocationClick}
    >
      <I18n.Text string="locations.change_location" />
    </Button>
  );
};

export default CartItemCardReservationLabelChangeStore;
