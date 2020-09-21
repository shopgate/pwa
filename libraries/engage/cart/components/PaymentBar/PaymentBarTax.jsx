// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_TAX,
  getTaxLine,
} from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarTax.connector';

type TaxData = {
  label: string,
  amount: number,
}

type Props = {
  taxData?: TaxData,
  showSeparator?: boolean,
  className?: string,
}

/**
 * The Tax component.
 * @returns {JSX}
 */
function PaymentBarTax({ taxData, showSeparator, className }: Props) {
  const {
    currency, isLoading, config, hasPromotionCoupons,
  } = React.useContext(CartContext);

  if (!taxData) {
    return null;
  }

  const taxLine = getTaxLine(config, taxData);

  if (!taxLine) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_TAX}>
      <CartTotalLine isDisabled={isLoading} type="tax" className={className}>
        <CartTotalLine.Label label={taxLine.label} showSeparator={showSeparator} />
        <CartTotalLine.Amount amount={taxLine.amount} currency={currency} />
        <CartTotalLine.Hint hint={taxLine.hint} />
        { hasPromotionCoupons && (
          <CartTotalLine.Spacer className={spacer} />
        )}
      </CartTotalLine>
    </SurroundPortals>
  );
}

PaymentBarTax.defaultProps = {
  taxData: null,
  className: null,
  showSeparator: true,
};

export default connect(PaymentBarTax);
