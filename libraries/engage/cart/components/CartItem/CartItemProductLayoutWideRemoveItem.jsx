import React from 'react';
import { RippleButton, I18n, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useCartItemProduct } from './CartItem.hooks';

const useStyles = makeStyles()(theme => ({
  button: {
    letterSpacing: '0.05em',
    padding: `${theme.spacing(2, 0)} !important`,
    ' *': {
      padding: '0 !important',
    },
  },
  ripple: {
    padding: 0,
  },
}));

/**
 * @returns {JSX.Element}
 */
const CartItemProductLayoutWideRemoveItem = () => {
  const { classes } = useStyles();
  const { handleRemove } = useCartItemProduct();

  return (
    <RippleButton
      onClick={handleRemove}
      className={classes.button}
      rippleClassName={classes.ripple}
      type="secondary"
      flat
    >
      <Typography variant="body2" component="span">
        <I18n.Text string="cart.remove_item" />
      </Typography>
    </RippleButton>
  );
};

export { CartItemProductLayoutWideRemoveItem };
