import React, { useMemo } from 'react';
import {
  ROPIS,
  BOPIS,
} from '@shopgate/engage/locations';
import { I18n } from '@shopgate/engage/components';
import { useCartItemProduct } from './CartItem.hooks';
import { caption } from './CartItemProductPriceCaption.style';

/**
 * @returns {JSX}
 */
const CartItemProductPriceCaption = () => {
  const { cartItem } = useCartItemProduct();

  const label = useMemo(() => {
    const labels = {
      [ROPIS]: 'cart.price_caption.reservation',
      [BOPIS]: 'cart.price_caption.pay_in_store',
    };

    const fulfillmentMethod = cartItem?.fulfillment?.method || null;

    return labels[fulfillmentMethod];
  }, [cartItem]);

  if (!label) {
    return null;
  }

  return (
    <span className={caption}>
    (
      <I18n.Text string={label} />
    )
    </span>
  );
};

export { CartItemProductPriceCaption };
