import React from 'react';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { button, ripple } from './CartItemProductLayoutWideRemoveItem.style';

type Props = {
  handleDelete: () => any,
}

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CartItemProductLayoutWideRemoveItem = ({ handleDelete }:Props) => (
  <RippleButton
    onClick={handleDelete}
    className={button}
    rippleClassName={ripple}
    type="secondary"
    flat
  >
    <I18n.Text string="cart.remove_item" />
  </RippleButton>
);

export { CartItemProductLayoutWideRemoveItem };
