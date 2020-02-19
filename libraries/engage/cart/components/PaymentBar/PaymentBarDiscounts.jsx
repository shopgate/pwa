// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_PAYMENT_BAR_TOTALS_DISCOUNTS } from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import connect from './PaymentBarDiscounts.connector';

type Props = {
  discounts?: Object[];
}

/**
 * The Discounts component.
 * @returns {JSX}
 */
function PaymentBarDiscounts({ discounts }: Props) {
  const { currency, isLoading } = React.useContext(CartContext);

  if (!discounts) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_DISCOUNTS}>
      {discounts.map(({ label, amount }) => (
        <CartTotalLine key={`discount-${label}-${amount}`} type="discount" isDisabled={isLoading}>
          <CartTotalLine.Label
            label={label ? 'cart.discount_with_label' : 'cart.discount'}
            labelParams={{ label }}
          />
          <CartTotalLine.Amount amount={-amount} currency={currency} />
        </CartTotalLine>
      ))}
    </SurroundPortals>
  );
}

PaymentBarDiscounts.defaultProps = {
  discounts: null,
};

export default connect(PaymentBarDiscounts);
