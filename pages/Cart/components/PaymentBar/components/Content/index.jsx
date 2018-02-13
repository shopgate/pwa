/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import sizeMe from 'react-sizeme';
import Grid from '@shopgate/pwa-common/components/Grid';
import ShippingCostsLabel from './components/ShippingCostsLabel';
import ShippingCosts from './components/ShippingCosts';
import SubTotalLabel from './components/SubTotalLabel';
import SubTotal from './components/SubTotal';
import CheckoutButton from './components/CheckoutButton';
import styles from './style';

/**
 * The Payment Bar component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Content = () => (
  /**
   * Because the sizeMe HOC needs a real dom element to measure the height of the Content
   * component, we can't use a Fragment as a wrapper here.
   */
  <div>
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
  </div>
);

export default sizeMe({ monitorHeight: true })(Content);
