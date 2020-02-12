import React, { useContext } from 'react';
import { I18n, RippleButton, SurroundPortals } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/engage/cart';
import CartContext from '../../../../../../context';
import styles from '../CheckoutButton/style';

/**
 * The reserve button component.
 * @return {JSX}
 */
const ReserveButton = () => {
  const { flags: { orderable } } = useContext(CartContext);

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} portalProps={{ isActive: orderable }}>
      <RippleButton
        disabled={!orderable}
        type="regular"
        className={orderable ? styles.button : styles.disabledButton}
      >
        <I18n.Text string="cart.reserve" />
      </RippleButton>
    </SurroundPortals>
  );
};

export default ReserveButton;
