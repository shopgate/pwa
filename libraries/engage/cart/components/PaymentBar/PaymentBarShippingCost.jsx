// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR_TOTALS_SHIPPING,
  getShippingLine,
} from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarShippingCost.connector';

type ShippingCostProp = {
  label: string;
  amount: number;
}

type Props = {
  shippingCost?: ShippingCostProp;
}

/**
 * @returns {JSX}
 */
function PaymentBarShippingCost({ shippingCost }: Props) {
  const {
    currency, isLoading, isUserLoggedIn, config,
  } = React.useContext(CartContext);

  const shippingLine = React.useMemo(() => (
    getShippingLine(config, isUserLoggedIn, shippingCost)
  ), [config, isUserLoggedIn, shippingCost]);

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_SHIPPING}>
      {shippingLine && (
        <CartTotalLine isDisabled={isLoading} type="shipping">
          <CartTotalLine.Label
            label={shippingLine.label}
            showSeparator={!!shippingLine.amount}
          />
          <CartTotalLine.Amount
            amount={shippingLine.amount}
            currency={currency}
          />
          <CartTotalLine.Hint hint={shippingLine.hint} />
        </CartTotalLine>
      )}
    </SurroundPortals>
  );
}

PaymentBarShippingCost.defaultProps = {
  shippingCost: null,
};

export default connect(PaymentBarShippingCost);
