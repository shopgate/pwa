import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { SurroundPortals, CartTotalLine } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import { CART_PAYMENT_BAR_TOTALS_DISCOUNTS } from '@shopgate/pwa-common-commerce/cart';
import { getDiscounts } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CartContext } from '../../cart.context';

export interface PaymentBarDiscountsProps {
  showSeparator?: boolean;
  className?: string | null;
}

interface Discount {
  label: string;
  amount: number;
}

const useStyles = makeStyles()({
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
});

/**
 * The Discounts component.
 * @returns The rendered component or null.
 */
function PaymentBarDiscounts({ showSeparator = true, className = null }: PaymentBarDiscountsProps) {
  const { classes } = useStyles();
  const discounts: Discount[] | null = useSelector(getDiscounts);
  const { currency, isLoading, hasPromotionCoupons } = useContext(CartContext);

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
          {hasPromotionCoupons && (
            <CartTotalLine.Spacer className={classes.spacer} />
          )}
        </CartTotalLine>
      ))}
    </SurroundPortals>
  );
}

export default PaymentBarDiscounts;
