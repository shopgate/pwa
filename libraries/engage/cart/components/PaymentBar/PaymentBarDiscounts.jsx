// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_PAYMENT_BAR_TOTALS_DISCOUNTS } from '@shopgate/pwa-common-commerce/cart';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';
import { CartContext } from '../../cart.context';
import { spacer } from './PaymentBarContent.style';
import connect from './PaymentBarDiscounts.connector';

type Props = {
  discounts?: Object[],
  showSeparator?: boolean,
  className?: string,
}

/**
 * The Discounts component.
 * @returns {JSX}
 */
function PaymentBarDiscounts({ discounts, showSeparator, className }: Props) {
  const { currency, isLoading, hasPromotionCoupons } = React.useContext(CartContext);

  if (!discounts) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_DISCOUNTS}>
      {discounts.map(({ label, amount }) => (
        <CartTotalLine
          key={`discount-${label}-${amount}`}
          type="discount"
          isDisabled={isLoading}
          className={className}
        >
          <CartTotalLine.Label
            label={label ? 'cart.discount_with_label' : 'cart.discount'}
            labelParams={{ label }}
            showSeparator={showSeparator}
          />
          <CartTotalLine.Amount amount={-amount} currency={currency} />
          { hasPromotionCoupons && (
            <CartTotalLine.Spacer className={spacer} />
          )}
        </CartTotalLine>
      ))}
    </SurroundPortals>
  );
}

PaymentBarDiscounts.defaultProps = {
  discounts: null,
  className: null,
  showSeparator: true,
};

export default connect(PaymentBarDiscounts);
