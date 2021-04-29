// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_SHIPPING,
  getShippingLine,
} from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarShippingCost.connector';

type ShippingCostProp = {
  label: string | null,
  amount: number,
}

type Props = {
  shippingCost?: ShippingCostProp,
  showSeparator?: boolean,
  className?: string,
}

/**
 * @returns {JSX}
 */
function PaymentBarShippingCost({ shippingCost, showSeparator, className }: Props) {
  const {
    currency, isLoading, isUserLoggedIn, config, hasPromotionCoupons,
  } = React.useContext(CartContext);

  const shippingLine = React.useMemo(() => (
    getShippingLine(config, isUserLoggedIn, shippingCost)
  ), [config, isUserLoggedIn, shippingCost]);

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_SHIPPING}>
      {shippingLine && (
        <CartTotalLine isDisabled={isLoading} type="shipping" className={className}>
          <CartTotalLine.Label
            label={shippingLine.label}
            showSeparator={showSeparator !== null ? showSeparator : !!shippingLine.amount}
          />
          <CartTotalLine.Amount
            amount={shippingLine.amount}
            currency={currency}
          />
          <CartTotalLine.Hint hint={shippingLine.hint} />
          { hasPromotionCoupons && (
            <CartTotalLine.Spacer className={spacer} />
          )}
        </CartTotalLine>
      )}
    </SurroundPortals>
  );
}

PaymentBarShippingCost.defaultProps = {
  className: null,
  showSeparator: true,
  shippingCost: null,
};

export default connect(PaymentBarShippingCost);
