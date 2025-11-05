import React from 'react';
import {
  BOPIS,
  ROPIS,
} from '@shopgate/engage/locations';
import { i18n } from '@shopgate/engage/core';
import { label } from './CartItemProductLayoutWideFulfillmentLabel.style';
import { useCartItemProduct } from './CartItem.hooks';

/**
 * @returns {JSX.Element}
 */
const CartItemProductLayoutWideFulfillmentLabel = () => {
  const { cartItem } = useCartItemProduct();
  const fulfillmentMethod = cartItem?.fulfillment?.method || null;

  let suffix = 'direct_ship';

  if (fulfillmentMethod === BOPIS) {
    suffix = 'bopis';
  } else if (fulfillmentMethod === ROPIS) {
    suffix = 'ropis';
  }

  return (
    <div className={label}>
      {i18n.text(`locations.method.${suffix}`)}
    </div>
  );
};

export { CartItemProductLayoutWideFulfillmentLabel };
