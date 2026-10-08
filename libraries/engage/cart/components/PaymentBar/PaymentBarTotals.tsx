import type { ComponentType, ReactNode } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import UntypedGrid from '@shopgate/pwa-common/components/Grid';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_PAYMENT_BAR_TOTALS } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import PaymentBarShippingCost from './PaymentBarShippingCost';
import UntypedDiscounts from './PaymentBarDiscounts';
import UntypedTax from './PaymentBarTax';
import UntypedSubTotal from './PaymentBarSubTotal';
import UntypedGrandTotal from './PaymentBarGrandTotal';
import UntypedPromotionCoupons from './PaymentBarPromotionCoupons';
import UntypedAppliedPromotions from './PaymentBarAppliedPromotions';

export interface PaymentBarTotalsProps {
  /** Whether the lines show separators. */
  showSeparator?: boolean;
  className?: string | null;
}

type TotalLine = ComponentType<{ showSeparator?: boolean }>;

const Grid = UntypedGrid as unknown as ComponentType<{ className?: string; children?: ReactNode }>;
const PaymentBarSubTotal = UntypedSubTotal as unknown as TotalLine;
const PaymentBarAppliedPromotions = UntypedAppliedPromotions as unknown as TotalLine;
const PaymentBarPromotionCoupons = UntypedPromotionCoupons as unknown as TotalLine;
const PaymentBarDiscounts = UntypedDiscounts as unknown as TotalLine;
const PaymentBarTax = UntypedTax as unknown as TotalLine;
const PaymentBarGrandTotal = UntypedGrandTotal as unknown as TotalLine;

const useStyles = makeStyles()(theme => ({
  container: {
    padding: isIOSTheme() ? theme.spacing(1) : theme.spacing(2),
    paddingBottom: 0,
    flexWrap: 'wrap',
    flexDirection: 'column',
    minWidth: 'auto',
  },
}));

/**
 * The totals of the cart: sub total, promotions, discounts, shipping, tax and grand total.
 * @returns The totals.
 */
function PaymentBarTotals({ showSeparator = true, className = null }: PaymentBarTotalsProps) {
  const { classes, cx } = useStyles();

  return (
    <Grid className={cx(classes.container, 'theme__cart__payment-bar__totals', className)}>
      <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS}>
        <PaymentBarSubTotal showSeparator={showSeparator} />
        <PaymentBarAppliedPromotions showSeparator={showSeparator} />
        <PaymentBarPromotionCoupons showSeparator={showSeparator} />
        <PaymentBarDiscounts showSeparator={showSeparator} />
        <PaymentBarShippingCost showSeparator={showSeparator} />
        <PaymentBarTax showSeparator={showSeparator} />
        <PaymentBarGrandTotal showSeparator={showSeparator} />
      </SurroundPortals>
    </Grid>
  );
}

export default PaymentBarTotals;
