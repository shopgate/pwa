import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import Grid from '@shopgate/pwa-common/components/Grid';
import { SurroundPortals } from '@shopgate/engage/components';
import { CART_PAYMENT_BAR_TOTALS } from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import PaymentBarShippingCost from './PaymentBarShippingCost';
import PaymentBarDiscounts from './PaymentBarDiscounts';
import PaymentBarTax from './PaymentBarTax';
import PaymentBarSubTotal from './PaymentBarSubTotal';
import PaymentBarGrandTotal from './PaymentBarGrandTotal';
import PaymentBarPromotionCoupons from './PaymentBarPromotionCoupons';
import PaymentBarAppliedPromotions from './PaymentBarAppliedPromotions';

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
 * @param {Object} props The component props.
 * @param {boolean} props.showSeparator Whether the lines show separators.
 * @param {string} props.className An additional class name.
 * @returns {JSX.Element}
 */
function PaymentBarTotals({ showSeparator, className }) {
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

PaymentBarTotals.propTypes = {
  className: PropTypes.string,
  showSeparator: PropTypes.bool,
};

PaymentBarTotals.defaultProps = {
  className: null,
  showSeparator: true,
};

export default PaymentBarTotals;
