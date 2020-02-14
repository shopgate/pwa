// @flow
import * as React from 'react';
import { I18n, SurroundPortals, RippleButton } from '@shopgate/engage/components';
import { FulfillmentSheet } from '@shopgate/engage/locations';
import {
  CART_CHECKOUT_BUTTON,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { CartContext } from '../../cart.context';
import { button, disabledButton } from './PaymentBarCheckoutButton.style';

/**
 * The reserve button component.
 * @return {JSX}
 */
function PaymentBarReserveButton() {
  const { flags: { orderable } } = React.useContext(CartContext);

  const handleClick = React.useCallback(() => {
    FulfillmentSheet.open(() => { }, 1);
  }, []);

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} props={{ isActive: orderable }}>
      <RippleButton
        onClick={handleClick}
        disabled={!orderable}
        type="regular"
        className={orderable ? button : disabledButton}
      >
        <I18n.Text string="cart.reserve" />
      </RippleButton>
    </SurroundPortals>
  );
}

export default PaymentBarReserveButton;
