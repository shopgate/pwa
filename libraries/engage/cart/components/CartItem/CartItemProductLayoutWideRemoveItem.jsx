import React from 'react';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { button, ripple } from './CartItemProductLayoutWideRemoveItem.style';
import { useCartItemProduct } from './CartItem.hooks';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CartItemProductLayoutWideRemoveItem = () => {
  const { handleRemove } = useCartItemProduct();

  return (
    <RippleButton
      onClick={handleRemove}
      className={button}
      rippleClassName={ripple}
      type="secondary"
      flat
    >
      <I18n.Text string="cart.remove_item" />
    </RippleButton>
  );
};

export { CartItemProductLayoutWideRemoveItem };
