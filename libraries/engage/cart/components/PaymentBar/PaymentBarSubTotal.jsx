// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarSubTotal.connector';

type Props = {
  amount: number,
  label?: string,
  showSeparator?: boolean,
  className?: string,
}

/**
 * @returns {JSX}
 */
function PaymentBarSubTotal({
  amount, label, showSeparator, className,
}: Props) {
  const { currency, isLoading, hasPromotionCoupons } = React.useContext(CartContext);

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL}>
      {amount &&
        <CartTotalLine isDisabled={isLoading} type="subTotal" className={className}>
          <CartTotalLine.Label label={label} showSeparator={showSeparator} />
          <CartTotalLine.Amount amount={amount} currency={currency} />
          { hasPromotionCoupons && (
            <CartTotalLine.Spacer className={spacer} />
          )}
        </CartTotalLine>
      }
    </SurroundPortals>
  );
}

PaymentBarSubTotal.defaultProps = {
  className: null,
  showSeparator: true,
  label: 'cart.subtotal',
};

export default connect(PaymentBarSubTotal);
