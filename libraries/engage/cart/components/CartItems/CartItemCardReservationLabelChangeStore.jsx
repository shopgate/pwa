import React, { useCallback } from 'react';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useCartItem } from '../CartItem';

const useStyles = makeStyles()({
  button: {
    fontSize: '0.875rem !important',
    letterSpacing: '0.05em',
    padding: '0px !important',
    ' *': {
      padding: '0px !important',
    },
  },
  ripple: {
    padding: 0,
  },
});

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
    <RippleButton
      onClick={handleChangeLocationClick}
      className={classes.button}
      rippleClassName={classes.ripple}
      type="secondary"
      flat
    >
      <I18n.Text string="locations.change_location" />
    </RippleButton>
  );
};

export default CartItemCardReservationLabelChangeStore;
