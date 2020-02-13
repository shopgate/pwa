// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarSubTotal.connector';

type Props = {
  amount: number;
}

/**
 * @returns {JSX}
 */
function PaymentBarSubTotal({ amount }: Props) {
  const { currency, isLoading } = React.useContext(CartContext);

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL}>
      {amount &&
        <CartTotalLine isDisabled={isLoading} type="subTotal">
          <CartTotalLine.Label label="cart.subtotal" />
          <CartTotalLine.Amount amount={amount} currency={currency} />
        </CartTotalLine>
      }
    </SurroundPortals>
  );
}

export default connect(PaymentBarSubTotal);
