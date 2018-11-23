import React from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_PAYMENT_BAR,
  CART_PAYMENT_BAR_BEFORE,
  CART_PAYMENT_BAR_AFTER,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import ShippingCostsLabel from './components/ShippingCostsLabel';
import ShippingCosts from './components/ShippingCosts';
import SubTotalLabel from './components/SubTotalLabel';
import SubTotal from './components/SubTotal';
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
          <Grid.Item className={styles.labelColumn} grow={1}>
            <div className={styles.column}>
              <SubTotalLabel />
              <ShippingCostsLabel />
            </div>
          </Grid.Item>

          <Grid.Item className={styles.costsColumn} grow={1}>
            <div className={styles.column}>
              <SubTotal />
              <ShippingCosts />
            </div>
          </Grid.Item>
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
