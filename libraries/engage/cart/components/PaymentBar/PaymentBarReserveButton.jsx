// @flow
import * as React from 'react';
import { I18n, SurroundPortals, RippleButton } from '@shopgate/engage/components';
import {
  CART_CHECKOUT_BUTTON,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { FulfillmentSheet, STAGE_RESERVE_FORM } from '../../../locations';
import { CartContext } from '../../cart.context';
import { button, disabledButton } from './PaymentBarCheckoutButton.style';
import connect from './PaymentBarReserveButton.connector';

type Props = {
  historyReset: () => {}
}

/**
 * The reserve button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function PaymentBarReserveButton({ historyReset }: Props) {
  const { flags: { orderable } } = React.useContext(CartContext);

  /**
   * Handles the click on the button.
   */
  function handleClick() {
    FulfillmentSheet.open({
      stage: STAGE_RESERVE_FORM,
      callback: (l, p, orderSuccess) => {
        if (orderSuccess === true) {
          historyReset();
        }
      },
    });
  }

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

export default connect(PaymentBarReserveButton);
