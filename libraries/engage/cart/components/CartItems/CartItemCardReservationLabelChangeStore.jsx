import React, { useCallback } from 'react';
import { I18n } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { useCartItem } from '../CartItem';

const useStyles = makeStyles()(() => ({
  button: {
    // Inline affordance in the reservation label: no padding of its own, and sentence case.
    padding: 0,
    textTransform: 'none',
  },
}));

/**
 * @returns {JSX}
 */
const CartItemCardReservationLabelChangeStore = () => {
  const { classes } = useStyles();
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
      variant="text"
      color="primary"
      onClick={handleChangeLocationClick}
      className={classes.button}
    >
      <I18n.Text string="locations.change_location" />
    </Button>
  );
};

export default CartItemCardReservationLabelChangeStore;
