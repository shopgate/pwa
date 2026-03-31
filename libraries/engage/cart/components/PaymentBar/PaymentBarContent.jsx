import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Grid from '@shopgate/pwa-common/components/Grid';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_PAYMENT_BAR,
  CART_PAYMENT_BAR_TOTALS,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import PaymentBarShippingCost from './PaymentBarShippingCost';
import PaymentBarDiscounts from './PaymentBarDiscounts';
import PaymentBarTax from './PaymentBarTax';
import PaymentBarSubTotal from './PaymentBarSubTotal';
import PaymentBarGrandTotal from './PaymentBarGrandTotal';
import PaymentBarCheckoutButton from './PaymentBarCheckoutButton';
import PaymentBarPromotionCoupons from './PaymentBarPromotionCoupons';
import PaymentBarAppliedPromotions from './PaymentBarAppliedPromotions';

const { colors, shadows } = themeConfig;

const useStyles = makeStyles()(theme => ({
  wrapper: {
    background: colors.light,
    boxShadow: shadows.cart.paymentBar,
    position: 'relative',
    zIndex: 2,
    paddingBottom: 'var(--safe-area-inset-bottom)',
  },
  container: {
    padding: isIOSTheme() ? theme.spacing(1) : theme.spacing(2),
    paddingBottom: 0,
    lineHeight: 1.45,
    flexWrap: 'wrap',
    flexDirection: 'column',
    minWidth: 'auto',
  },
  checkoutButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  checkoutButtonContainer: {
    background: colors.light,
    alignItems: 'center',
    padding: isIOSTheme() ? theme.spacing(1) : theme.spacing(2),
    position: 'relative',
    zIndex: 2,
  },
}));

/**
 * The PaymentBarContent component.
 * @returns {JSX}
 */
function PaymentBarContent({ showSeparator }) {
  const { classes, cx } = useStyles();
  return (
    <div className={cx(classes.wrapper, 'theme__cart__payment-bar')}>
      <SurroundPortals portalName={CART_PAYMENT_BAR}>
        <Grid className={classes.container}>
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
        <div className={classes.checkoutButtonContainer}>
          <div className={classes.checkoutButton}>
            <PaymentBarCheckoutButton />
          </div>
        </div>
      </SurroundPortals>
    </div>
  );
}

PaymentBarContent.propTypes = {
  showSeparator: PropTypes.bool,
};

PaymentBarContent.defaultProps = {
  showSeparator: true,
};

export default PaymentBarContent;
