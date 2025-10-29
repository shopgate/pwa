import React from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals, RippleButton } from '@shopgate/engage/components';
import { CART_CHECKOUT_BUTTON } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { FulfillmentSheet, STAGE_RESERVE_FORM } from '../../../locations';
import { CartContext } from '../../cart.context';
import { button, disabledButton } from './PaymentBarCheckoutButton.style';
import connect from './PaymentBarReserveButton.connector';

/**
 * The reserve button component.
 * @param {Object} props The component props.
 * @param {Function} props.historyReset The history reset function.
 * @return {JSX.Element} The rendered component.
 */
const PaymentBarReserveButton = ({ historyReset }) => {
  const { flags: { orderable } } = React.useContext(CartContext);

  /**
   * Handles the click on the button.
   */
  function handleClick() {
    FulfillmentSheet.open({
      stage: STAGE_RESERVE_FORM,
      callback: (location, product, orderSuccess) => {
        if (orderSuccess === true) {
          historyReset();
        }
      },
    });
  }

  return (
    <SurroundPortals portalName={CART_CHECKOUT_BUTTON} portalProps={{ isActive: orderable }}>
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
};

PaymentBarReserveButton.propTypes = {
  historyReset: PropTypes.func.isRequired,
};

export default connect(PaymentBarReserveButton);
