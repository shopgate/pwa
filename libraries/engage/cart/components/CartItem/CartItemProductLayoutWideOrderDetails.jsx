import React, { Fragment } from 'react';
import { QuantityLabel } from '@shopgate/engage/components';
import { PRODUCT_UNIT_EACH } from '@shopgate/engage/product';
import { getTranslatedLineItemStatus } from '@shopgate/engage/orders';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';

import {
  column,
  locationColumn,
  statusColumn,
  quantityPickerDisabled,
} from './CartItemProductLayoutWide.style';

/**
 * @returns {JSX}
 */
const CartItemProductLayoutWide = () => {
  const { location, cartItem } = useCartItem();
  const { product } = useCartItemProduct();

  const hasUnitWithDecimals = product.unit && product.unit !== PRODUCT_UNIT_EACH;

  return (
    <Fragment>
      <div className={locationColumn}>
        { location?.name }
      </div>
      <div className={statusColumn}>
        {getTranslatedLineItemStatus(cartItem?.status, cartItem?.subStatus)}
      </div>
      <div className={column}>
        <QuantityLabel
          className={quantityPickerDisabled}
          value={cartItem.quantity}
          unit={hasUnitWithDecimals ? product.unit : null}
          maxDecimals={hasUnitWithDecimals ? 2 : 0}
        />
      </div>
    </Fragment>
  );
};

export default CartItemProductLayoutWide;
