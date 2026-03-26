import React from 'react';
import { QuantityLabel } from '@shopgate/engage/components';
import { getTranslatedLineItemStatus } from '@shopgate/engage/orders';
import { makeStyles } from '@shopgate/engage/styles';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';

const useStyles = makeStyles()(theme => ({
  column: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
    padding: theme.spacing(0, 1),
    ':last-child': {
      paddingRight: 0,
    },
  },
  locationColumn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 1,
    flexGrow: 2,
    flexBasis: 0,
    padding: theme.spacing(0, 1),
    ':last-child': {
      paddingRight: 0,
    },
    fontSize: '1.25rem',
    lineHeight: '1.625rem',
    fontWeight: 500,
  },
  statusColumn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
    padding: theme.spacing(0, 1),
    ':last-child': {
      paddingRight: 0,
    },
    fontSize: '1.25rem',
    lineHeight: '1.625rem',
  },
  quantityPickerDisabled: {
    padding: theme.spacing(0, 1),
    textAlign: 'center',
    fontSize: '1.25rem',
    lineHeight: '1.625rem',
    height: 28,
    width: '100%',
    fontWeight: 500,
    color: 'var(--color-text-high-emphasis)',
    whiteSpace: 'nowrap',
  },
}));

/**
 * @returns {JSX.Element}
 */
const CartItemProductLayoutWideOrderDetails = () => {
  const { classes } = useStyles();
  const { location, cartItem, cartIsDirectShipOnly } = useCartItem();
  const { product } = useCartItemProduct();

  const hasUnitWithDecimals = (product.unit && product.hasCatchWeight) || false;

  return (
    <>
      {!cartIsDirectShipOnly ? (
        <div className={classes.locationColumn}>
          {location?.name }
        </div>
      ) : null}
      <div className={classes.statusColumn}>
        {getTranslatedLineItemStatus(cartItem?.status, cartItem?.subStatus)}
      </div>
      <div className={classes.column}>
        <QuantityLabel
          className={classes.quantityPickerDisabled}
          value={cartItem.quantity}
          unit={hasUnitWithDecimals ? product.unit : null}
          maxDecimals={hasUnitWithDecimals ? 2 : 0}
        />
      </div>
    </>
  );
};

export default CartItemProductLayoutWideOrderDetails;
