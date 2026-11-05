import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { SurroundPortals, CartTotalLine } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import {
  CART_PAYMENT_BAR_TOTALS_SUB_TOTAL,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { getSubTotal } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CartContext } from '../../cart.context';

export interface PaymentBarSubTotalProps {
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
 * Renders the PaymentBarSubTotal component.
 * @returns The rendered component.
 */
const PaymentBarSubTotal = ({
  label = 'cart.subtotal', showSeparator = true, className = null,
}: PaymentBarSubTotalProps) => {
  const { classes } = useStyles();
  const amount = useSelector(getSubTotal);
  const { currency, isLoading, hasPromotionCoupons } = useContext(CartContext);

  return (
    <SurroundPortals portalName={CART_PAYMENT_BAR_TOTALS_SUB_TOTAL}>
      {amount && (
        <CartTotalLine isDisabled={isLoading} type="subTotal" className={className}>
          <CartTotalLine.Label label={label} showSeparator={showSeparator} />
          <CartTotalLine.Amount amount={amount} currency={currency} />
          {hasPromotionCoupons && (
            <CartTotalLine.Spacer className={classes.spacer} />
          )}
        </CartTotalLine>
      )}
    </SurroundPortals>
  );
};

export default PaymentBarSubTotal;
