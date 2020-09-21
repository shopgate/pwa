// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarGrandTotal.connector';

type Props = {
  amount: number,
  showSeparator?: boolean,
  label?: string,
  className?: string,
}

/**
 * The GrandTotal component.
 * @returns {JSX}
 */
function PaymentBarGrandTotal({
  amount, label, showSeparator, className,
}: Props) {
  const {
    config: { hideTotal }, isLoading, currency, hasPromotionCoupons,
  } = React.useContext(CartContext);

  if (hideTotal) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL}>
      <CartTotalLine isDisabled={isLoading} type="grandTotal" className={className}>
        <CartTotalLine.Label label={label} showSeparator={showSeparator} />
        <CartTotalLine.Amount amount={amount} currency={currency} />
        { hasPromotionCoupons && (
          <CartTotalLine.Spacer className={spacer} />
        )}
      </CartTotalLine>
    </SurroundPortals>
  );
}

PaymentBarGrandTotal.defaultProps = {
  className: null,
  showSeparator: true,
  label: 'cart.total',
};

export default connect(PaymentBarGrandTotal);
