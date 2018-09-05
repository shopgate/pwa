import React from 'react';
import sizeMe from 'react-sizeme';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import ShippingCostsLabel from './components/ShippingCostsLabel';
import ShippingCosts from './components/ShippingCosts';
import SubTotalLabel from './components/SubTotalLabel';
import SubTotal from './components/SubTotal';
import CheckoutButton from './components/CheckoutButton';
import styles from './style';

/**
 * The Payment Bar component.
 * @return {JSX}
 */
const Content = () => (
  /**
   * Because the sizeMe HOC needs a real dom element to measure the height of the Content
   * component, we can't use a Fragment as a wrapped here.
   */
  <div>
    <Portal name={portals.CART_PAYMENT_BAR_BEFORE} />
    <Portal name={portals.CART_PAYMENT_BAR} >
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

        <Grid.Item className={styles.buttonColumn} grow={1}>
          <div className={styles.column}>
            <div className={styles.checkoutButton}>
              <CheckoutButton />
            </div>
          </div>
        </Grid.Item>
      </Grid>
    </Portal>
    <Portal name={portals.CART_PAYMENT_BAR_AFTER} />
  </div>
);

export default sizeMe({ monitorHeight: true, noPlaceholder: true })(Content);
