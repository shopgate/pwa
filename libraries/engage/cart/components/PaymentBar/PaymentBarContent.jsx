import * as React from 'react';
import PropTypes from 'prop-types';
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
import {
  wrapper, container, checkoutButtonContainer, checkoutButton,
} from './PaymentBarContent.style';

/**
 * The PaymentBarContent component.
 * @returns {JSX}
 */
function PaymentBarContent({ showSeparator }) {
  return (
    <div className={wrapper}>
      <SurroundPortals portalName={CART_PAYMENT_BAR}>
        <Grid className={container}>
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
        <div className={checkoutButtonContainer}>
          <div className={checkoutButton}>
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
