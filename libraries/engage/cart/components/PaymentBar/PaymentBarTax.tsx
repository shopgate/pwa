import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { SurroundPortals, CartTotalLine } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import {
  CART_PAYMENT_BAR_TOTALS_TAX,
  getTaxLine,
} from '@shopgate/pwa-common-commerce/cart';
import { getTax } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CartContext } from '../../cart.context';

export interface PaymentBarTaxProps {
  showSeparator?: boolean;
  className?: string | null;
}

interface TaxLine {
  label?: string;
  amount: number | string;
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
 * The Tax component.
 * @returns The rendered component or null.
 */
const PaymentBarTax = ({ showSeparator = true, className = null }: PaymentBarTaxProps) => {
  const { classes } = useStyles();
  const taxData = useSelector(getTax);
  const {
    currency, isLoading, config, hasPromotionCoupons,
  } = useContext(CartContext);

  if (!taxData) {
    return null;
  }

  const taxLine = getTaxLine(config, taxData) as TaxLine | null;

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
          <CartTotalLine.Spacer className={classes.spacer} />
        )}
      </CartTotalLine>
    </SurroundPortals>
  );
};

export default PaymentBarTax;
