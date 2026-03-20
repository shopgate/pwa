import React from 'react';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useCartItemProduct } from './CartItem.hooks';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  button: {
    fontSize: '0.875rem !important',
    letterSpacing: '0.05em',
    padding: `${variables.gap.big}px 0 !important`,
    ' *': {
      padding: '0 !important',
    },
  },
  ripple: {
    padding: 0,
  },
});

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
      <I18n.Text string="cart.remove_item" />
    </RippleButton>
  );
};

export { CartItemProductLayoutWideRemoveItem };
