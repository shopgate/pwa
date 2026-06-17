import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { Typography } from '@shopgate/engage/components';
import PaymentBarSubTotal from '../PaymentBar/PaymentBarSubTotal';
import PaymentBarGrandTotal from '../PaymentBar/PaymentBarGrandTotal';
import PaymentBarShippingCost from '../PaymentBar/PaymentBarShippingCost';
import PaymentBarDiscounts from '../PaymentBar/PaymentBarDiscounts';
import PaymentBarTax from '../PaymentBar/PaymentBarTax';
import PaymentBarAppliedPromotions from '../PaymentBar/PaymentBarAppliedPromotions';
import PaymentBarPromotionCoupons from '../PaymentBar/PaymentBarPromotionCoupons';
import CartSummaryWideCheckoutButton from './CartSummaryWideCheckoutButton';
import CartSummaryWideFooter from './CartSummaryWideFooter';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    padding: theme.spacing(2),
    width: 420,
  },
  headline: {
    lineHeight: '1.5rem',
  },
  summary: {
    background: theme.palette.background.emphasized,
    padding: theme.spacing(2),
  },
  total: {
    fontSize: '1rem',
    padding: theme.spacing(1, 0),
    color: theme.palette.text.primary,
  },
  grandTotal: {
    fontSize: '1.25rem !important',
    fontWeight: theme.typography.fontWeightMedium,
    borderTop: `1px solid ${theme.components.border.medium}`,
    padding: theme.spacing(1, 0),
    color: theme.palette.text.primary,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
}));

/**
 * The cart summary component for wide screens.
 * @returns {JSX}
 */
const CartSummaryWide = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h3" component="h2" className={classes.headline}>
        {i18n.text('checkout.summary.headline')}
      </Typography>
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
