// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals, RippleButton } from '@shopgate/engage/components';
import { FulfillmentSheet } from '@shopgate/engage/locations';
import {
  CART_CHECKOUT_BUTTON,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { CartContext } from '../../cart.context';
import { button, disabledButton } from './PaymentBarCheckoutButton.style';
import connect from './PaymentBarReserveButton.connector';

/**
 * The reserve button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
function PaymentBarReserveButton({ historyReset }) {
  const { flags: { orderable } } = React.useContext(CartContext);

  const handleClick = React.useCallback(() => {
    FulfillmentSheet.open(() => {
      historyReset();
    }, 1);
  }, [historyReset]);

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

PaymentBarReserveButton.propTypes = {
  historyReset: PropTypes.func.isRequired,
};

export default connect(PaymentBarReserveButton);
