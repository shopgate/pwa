import React from 'react';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import {
  BOPIS,
  ROPIS,
} from '@shopgate/engage/locations';
import { i18n } from '@shopgate/engage/core/helpers';
import { useCartItemProduct } from './CartItem.hooks';

const useStyles = makeStyles()({
  label: {
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
    <Typography variant="body2" component="div" color="secondary" className={classes.label}>
      {i18n.text(`locations.method.${suffix}`)}
    </Typography>
  );
};

export { CartItemProductLayoutWideFulfillmentLabel };
