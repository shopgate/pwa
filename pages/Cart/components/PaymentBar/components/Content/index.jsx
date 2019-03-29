import React from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_PAYMENT_BAR,
  CART_PAYMENT_BAR_BEFORE,
  CART_PAYMENT_BAR_AFTER,
  CART_PAYMENT_BAR_TOTALS,
  CART_PAYMENT_BAR_TOTALS_BEFORE,
  CART_PAYMENT_BAR_TOTALS_AFTER,
} from '@shopgate/pwa-common-commerce/cart';
import ShippingCosts from './components/ShippingCosts';
import Discounts from './components/Discounts';
import Tax from './components/Tax';
import SubTotal from './components/SubTotal';
import GrandTotal from './components/GrandTotal';
import CheckoutButton from './components/CheckoutButton';
import styles from './style';

/**
 * The PaymentBarContent component.
 * @returns {JSX}
 */
function PaymentBarContent() {
  return (
    <div className={styles.wrapper}>
      <Portal name={CART_PAYMENT_BAR_BEFORE} />
      <Portal name={CART_PAYMENT_BAR}>
        <Grid className={styles.container}>
          <Portal name={CART_PAYMENT_BAR_TOTALS_BEFORE} />
          <Portal name={CART_PAYMENT_BAR_TOTALS}>
            <SubTotal />
            <Discounts />
            <ShippingCosts />
            <Tax />
            <GrandTotal />
          </Portal>
          <Portal name={CART_PAYMENT_BAR_TOTALS_AFTER} />
        </Grid>
        <div className={styles.checkoutButtonContainer}>
          <div className={styles.checkoutButton}>
            <CheckoutButton />
          </div>
        </div>
      </Portal>
      <Portal name={CART_PAYMENT_BAR_AFTER} />
    </div>
  );
}

export default PaymentBarContent;
