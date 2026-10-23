import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { SurroundPortals, CartTotalLine } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import {
  CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { getGrandTotal } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CartContext } from '../../cart.context';

export interface PaymentBarGrandTotalProps {
  label?: string;
  showSeparator?: boolean;
  className?: string | null;
}

const useStyles = makeStyles()({
  spacer: {
    width: isIOSTheme() ? 27 : 32,
    order: 1,
    flexShrink: 0,
  },
});

/**
 * The GrandTotal component.
 * @returns The rendered component or null.
 */
const PaymentBarGrandTotal = ({
  label = 'cart.total', showSeparator = true, className = null,
}: PaymentBarGrandTotalProps) => {
  const { classes } = useStyles();
  const amount = useSelector(getGrandTotal);
  const {
    config, isLoading, currency, hasPromotionCoupons,
  } = useContext(CartContext);
  const { hideTotal } = config as { hideTotal?: boolean };

  if (hideTotal) {
    return null;
  }

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_GRAND_TOTAL}>
      <CartTotalLine isDisabled={isLoading} type="grandTotal" className={className}>
        <CartTotalLine.Label label={label} showSeparator={showSeparator} />
        <CartTotalLine.Amount amount={amount} currency={currency} />
        {hasPromotionCoupons && (
          <CartTotalLine.Spacer className={classes.spacer} />
        )}
      </CartTotalLine>
    </SurroundPortals>
  );
};

export default PaymentBarGrandTotal;
