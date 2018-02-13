/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import CTAButtons from './components/CTAButtons';
import Rating from './components/Rating';
import Name from './components/Name';
import Manufacturer from './components/Manufacturer';
import PriceStriked from './components/PriceStriked';
import Shipping from './components/Shipping';
import Availability from './components/Availability';
import Price from './components/Price';
import PriceInfo from './components/PriceInfo';
import Tiers from './components/Tiers';
import styles from './style';

/**
 * The product header component that displays textual information
 * - manufacturer
 * - shipping
 * - discount
 * - price
 * - tier prices
 * - price info
 * If not available or animating it will display placeholders
 * @returns {JSX}
 */
const ProductHeader = () => (
  <div className={styles.content}>
    <CTAButtons />
    <Rating />
    <Name />
    <Grid component="div">
      <Grid.Item component="div" grow={1}>
        <div className={styles.productInfo}>
          <Manufacturer />
        </div>
        <div className={styles.productInfo}>
          <Shipping />
        </div>
        <div className={styles.productInfo}>
          <Availability />
        </div>
      </Grid.Item>
      <Grid.Item component="div" className={styles.priceContainer}>
        <div className={styles.priceInfo}>
          <PriceStriked />
        </div>
        <div className={styles.priceInfo}>
          <Price className={styles.price} />
        </div>
        <div className={styles.priceInfo}>
          <PriceInfo />
        </div>
        <div className={styles.priceInfo}>
          <Tiers />
        </div>
      </Grid.Item>
      {showTaxDisclaimer && (
        <Grid.Item
          className={styles.disclaimerSpacer}
          component="div"
          grow={0}
          shrink={0}
        />
      )}
    </Grid>
  </div>
);

export default ProductHeader;
