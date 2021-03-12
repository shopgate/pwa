import React, { useMemo } from 'react';
import classNames from 'classnames';
import { QuantityLabel, I18n, Price } from '@shopgate/engage/components';
import { getTranslatedLineItemStatus } from '@shopgate/engage/orders';
import { CartItemProductPriceCaption } from './CartItemProductPriceCaption';
import { createCartItemPrices } from '../../cart.helpers';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';
import {
  quantityLabel, label, container, labelValue, fulfillmentLabel,
} from './CartItemProductOrderDetails.style';

/**
 * @returns {JSX}
 */
const CartItemProductOrderDetails = () => {
  const { location, cartItem, cartIsDirectShipOnly } = useCartItem();
  const { product, currency } = useCartItemProduct();

  const hasUnitWithDecimals = (product.unit && product.hasCatchWeight) || false;
  const unitPrice = useMemo(() => {
    const result = createCartItemPrices(cartItem).price;
    return result.slice(-1)[0].price;
  }, [cartItem]);

  return (
    <ul className={container}>
      { !cartIsDirectShipOnly && location?.name ? (
        <li>
          <I18n.Text string="cart.location" className={label} />
          <span className={labelValue}>
            {location?.name}
          </span>
          <CartItemProductPriceCaption className={fulfillmentLabel} />
        </li>
      ) : null}
      <li>
        <I18n.Text string="cart.status" className={label} />
        <span className={labelValue}>
          {getTranslatedLineItemStatus(cartItem?.status, cartItem?.subStatus)}
        </span>

      </li>
      <li>
        <I18n.Text string="cart.fulfilled_quantity" className={label} />
        <QuantityLabel
          className={classNames(quantityLabel, labelValue)}
          value={cartItem.quantity}
          unit={hasUnitWithDecimals ? product.unit : null}
          maxDecimals={hasUnitWithDecimals ? 2 : 0}
        />
      </li>
      <li>
        <I18n.Text string="cart.ordered_quantity" className={label} />
        <QuantityLabel
          className={classNames(quantityLabel, labelValue)}
          value={cartItem.orderedQuantity}
          unit={hasUnitWithDecimals ? product.unit : null}
          maxDecimals={hasUnitWithDecimals ? 2 : 0}
        />
      </li>
      <li>
        <I18n.Text string="cart.price" className={label} />
        <Price
          className={labelValue}
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
