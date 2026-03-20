import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import {
  BOPIS,
  ROPIS,
} from '@shopgate/engage/locations';
import { i18n } from '@shopgate/engage/core';
import { useCartItemProduct } from './CartItem.hooks';

const useStyles = makeStyles()({
  label: {
    color: 'var(--color-secondary)',
    fontSize: '0.875rem',
    marginTop: 'auto',
  },
});

/**
 * @returns {JSX.Element}
 */
const CartItemProductLayoutWideFulfillmentLabel = () => {
  const { classes } = useStyles();
  const { cartItem } = useCartItemProduct();
  const fulfillmentMethod = cartItem?.fulfillment?.method || null;

  let suffix = 'direct_ship';

  if (fulfillmentMethod === BOPIS) {
    suffix = 'bopis';
  } else if (fulfillmentMethod === ROPIS) {
    suffix = 'ropis';
  }

  return (
    <div className={classes.label}>
      {i18n.text(`locations.method.${suffix}`)}
    </div>
  );
};

export { CartItemProductLayoutWideFulfillmentLabel };
