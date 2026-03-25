import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import PaymentBarSubTotal from '../PaymentBar/PaymentBarSubTotal';
import PaymentBarGrandTotal from '../PaymentBar/PaymentBarGrandTotal';
import PaymentBarShippingCost from '../PaymentBar/PaymentBarShippingCost';
import PaymentBarDiscounts from '../PaymentBar/PaymentBarDiscounts';
import PaymentBarTax from '../PaymentBar/PaymentBarTax';
import PaymentBarAppliedPromotions from '../PaymentBar/PaymentBarAppliedPromotions';
import PaymentBarPromotionCoupons from '../PaymentBar/PaymentBarPromotionCoupons';
import CartSummaryWideCheckoutButton from './CartSummaryWideCheckoutButton';
import CartSummaryWideFooter from './CartSummaryWideFooter';

const { variables, colors } = themeConfig;

const useStyles = makeStyles()({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    padding: variables.gap.big,
    width: 420,
  },
  headline: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: '1.5rem',
  },
  summary: {
    background: 'var(--color-background-accent)',
    padding: variables.gap.big,
  },
  total: {
    fontSize: '1rem',
    padding: `${variables.gap.small}px 0`,
    color: 'var(--color-text-high-emphasis)',
  },
  grandTotal: {
    fontSize: '1.25rem !important',
    fontWeight: 500,
    borderTop: `1px solid ${colors.shade4}`,
    padding: `${variables.gap.small}px 0`,
    color: 'var(--color-text-high-emphasis)',
    '&:last-child': {
      paddingBottom: 0,
    },
  },
});

/**
 * The cart summary component for wide screens.
 * @returns {JSX}
 */
const CartSummaryWide = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <h2 className={classes.headline}>
        {i18n.text('checkout.summary.headline')}
      </h2>
      <div className={classes.summary}>
        <PaymentBarSubTotal showSeparator={false} label="cart.subtotal" className={classes.total} />
        <PaymentBarAppliedPromotions showSeparator={false} className={classes.total} />
        <PaymentBarPromotionCoupons showSeparator={false} className={classes.total} />
        <PaymentBarDiscounts showSeparator={false} className={classes.total} />
        <PaymentBarShippingCost showSeparator={false} className={classes.total} />
        <PaymentBarTax showSeparator={false} className={classes.total} />
        <PaymentBarGrandTotal
          showSeparator={false}
          label="cart.grand_total"
          className={classes.grandTotal}
        />
      </div>
      <CartSummaryWideCheckoutButton />
      <CartSummaryWideFooter />
    </div>
  );
};

export default CartSummaryWide;
