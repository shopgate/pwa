// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarGrandTotal.connector';

type Props = {
  amount: number;
}

/**
 * The GrandTotal component.
 * @returns {JSX}
 */
function PaymentBarGrandTotal({ amount }: Props) {
  const { config: { hideTotal }, isLoading, currency } = React.useContext(CartContext);

  if (hideTotal) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL}>
      <CartTotalLine isDisabled={isLoading} type="grandTotal">
        <CartTotalLine.Label label="cart.total" />
        <CartTotalLine.Amount amount={amount} currency={currency} />
      </CartTotalLine>
    </SurroundPortals>
  );
}

export default connect(PaymentBarGrandTotal);
