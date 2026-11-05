import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SurroundPortals, CartTotalLine } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import {
  CART_PAYMENT_BAR_TOTALS_SHIPPING,
  getShippingLine,
} from '@shopgate/pwa-common-commerce/cart';
import { getShippingCost } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CartContext } from '../../cart.context';

export interface PaymentBarShippingCostProps {
  /** With `null` the separator follows the shipping amount. */
  showSeparator?: boolean | null;
  className?: string | null;
}

interface ShippingLine {
  label: string;
  amount?: number;
  hint?: string;
}

const useStyles = makeStyles()({
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
});

/**
 * The PaymentBarShippingCost component.
 * @returns The rendered component.
 */
const PaymentBarShippingCost = ({
  showSeparator = true, className = null,
}: PaymentBarShippingCostProps) => {
  const { classes } = useStyles();
  const shippingCost = useSelector(getShippingCost);
  const {
    currency, isLoading, isUserLoggedIn, config, hasPromotionCoupons,
  } = useContext(CartContext);

  const shippingLine = useMemo(() => (
    getShippingLine(config, isUserLoggedIn, shippingCost) as ShippingLine | null
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
            <CartTotalLine.Spacer className={classes.spacer} />
          )}
        </CartTotalLine>
      )}
    </SurroundPortals>
  );
};

export default PaymentBarShippingCost;
