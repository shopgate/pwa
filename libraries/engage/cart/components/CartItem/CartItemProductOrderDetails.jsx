import React, { useMemo } from 'react';
import classNames from 'classnames';
import { QuantityLabel, I18n, Price } from '@shopgate/engage/components';
import { getTranslatedLineItemStatus } from '@shopgate/engage/orders';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CartItemProductPriceCaption } from './CartItemProductPriceCaption';
import { createCartItemPrices } from '../../cart.helpers';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    paddingTop: variables.gap.small,
  },
  quantityLabel: {
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  label: {
    ':after': {
      content: '": "',
    },
  },
  labelValue: {
    fontWeight: 500,
    display: 'inline',
    color: 'var(--color-text-medium-emphasis)',
  },
  fulfillmentLabel: {
    fontSize: 'inherit',
    ':before': {
      content: '" "',
    },
  },
});

/**
 * @returns {JSX.Element}
 */
const CartItemProductOrderDetails = () => {
  const { classes } = useStyles();
  const { location, cartItem, cartIsDirectShipOnly } = useCartItem();
  const { product, currency } = useCartItemProduct();

  const hasUnitWithDecimals = (product.unit && product.hasCatchWeight) || false;
  const unitPrice = useMemo(() => {
    const result = createCartItemPrices(cartItem).price;
    return result.slice(-1)[0].price;
  }, [cartItem]);

  return (
    <ul className={classes.container}>
      { !cartIsDirectShipOnly && location?.name ? (
        <li>
          <I18n.Text string="cart.location" className={classes.label} />
          <span className={classes.labelValue}>
            {location?.name}
          </span>
          <CartItemProductPriceCaption className={classes.fulfillmentLabel} />
        </li>
      ) : null}
      <li>
        <I18n.Text string="cart.status" className={classes.label} />
        <span className={classes.labelValue}>
          {getTranslatedLineItemStatus(cartItem?.status, cartItem?.subStatus)}
        </span>

      </li>
      <li>
        <I18n.Text string="cart.fulfilled_quantity" className={classes.label} />
        <QuantityLabel
          className={classNames(classes.quantityLabel, classes.labelValue)}
          value={cartItem.quantity}
          unit={hasUnitWithDecimals ? product.unit : null}
          maxDecimals={hasUnitWithDecimals ? 2 : 0}
        />
      </li>
      <li>
        <I18n.Text string="cart.ordered_quantity" className={classes.label} />
        <QuantityLabel
          className={classNames(classes.quantityLabel, classes.labelValue)}
          value={cartItem.orderedQuantity}
          unit={hasUnitWithDecimals ? product.unit : null}
          maxDecimals={hasUnitWithDecimals ? 2 : 0}
        />
      </li>
      <li>
        <I18n.Text string="cart.price" className={classes.label} />
        <Price
          className={classes.labelValue}
          currency={currency}
          taxDisclaimer
          unitPrice={unitPrice}
          allowFree
        />
      </li>
    </ul>

  );
};

export default CartItemProductOrderDetails;
