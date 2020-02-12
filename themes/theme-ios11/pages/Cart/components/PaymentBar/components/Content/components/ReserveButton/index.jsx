import React, { Fragment } from 'react';
import { I18n, Portal, RippleButton } from '@shopgate/engage/components';
import {
  CART_CHECKOUT_BUTTON,
  CART_CHECKOUT_BUTTON_AFTER,
  CART_CHECKOUT_BUTTON_BEFORE,
} from '@shopgate/engage/cart';
import CartContext from '../../../../../../context';
import styles from '../CheckoutButton/style';

/**
 * The reserve button component.
 * @return {JSX}
 */
const ReserveButton = () => (
  <CartContext.Consumer>
    {({ flags: { orderable } }) => (
      <Fragment>
        <Portal name={CART_CHECKOUT_BUTTON_BEFORE} props={{ isActive: orderable }} />
        <Portal name={CART_CHECKOUT_BUTTON} props={{ isActive: orderable }}>
          <RippleButton
            disabled={!orderable}
            type="regular"
            className={orderable ? styles.button : styles.disabledButton}
          >
            <I18n.Text string="cart.reserve" />
          </RippleButton>
        </Portal>
        <Portal name={CART_CHECKOUT_BUTTON_AFTER} props={{ isActive: orderable }} />
      </Fragment>
    )}
  </CartContext.Consumer>
);

export default ReserveButton;
