// @flow
import * as React from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR,
  CART_PAYMENT_BAR_TOTALS,
  FLAG_MULTI_LINE_RESERVE,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { CartContext } from '../../cart.context';
import PaymentBarShippingCost from './PaymentBarShippingCost';
import PaymentBarDiscounts from './PaymentBarDiscounts';
import PaymentBarTax from './PaymentBarTax';
import PaymentBarSubTotal from './PaymentBarSubTotal';
import PaymentBarGrandTotal from './PaymentBarGrandTotal';
import PaymentBarCheckoutButton from './PaymentBarCheckoutButton';
import PaymentBarReserveButton from './PaymentBarReserveButton';
import {
  wrapper, container, checkoutButtonContainer, checkoutButton,
} from './PaymentBarContent.style';

/**
 * The PaymentBarContent component.
 * @returns {JSX}
 */
function PaymentBarContent() {
  const { flags } = React.useContext(CartContext);

  return (
    <div className={wrapper}>
      <SurroundPortals portalName={CART_PAYMENT_BAR}>
        <Grid className={container}>
          <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS}>
            <PaymentBarSubTotal />
            <PaymentBarDiscounts />
            <PaymentBarShippingCost />
            <PaymentBarTax />
            <PaymentBarGrandTotal />
          </SurroundPortals>
        </Grid>
        <div className={checkoutButtonContainer}>
          <div className={checkoutButton}>
            {!flags[FLAG_MULTI_LINE_RESERVE] && <PaymentBarCheckoutButton />}
            {flags[FLAG_MULTI_LINE_RESERVE] && <PaymentBarReserveButton />}
          </div>
        </div>
      </SurroundPortals>
    </div>
  );
}

export default PaymentBarContent;
