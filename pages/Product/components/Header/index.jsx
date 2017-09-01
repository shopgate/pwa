/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import AddToCartButton from './components/AddToCartButton';
import Rating from './components/Rating';
import Name from './components/Name';
import Manufacturer from './components/Manufacturer';
import PriceStriked from './components/PriceStriked';
import Shipping from './components/Shipping';
import Availability from './components/Availability';
import Discount from './components/Discount';
import Price from './components/Price';
import PriceInfo from './components/PriceInfo';
import styles from './style';

/**
 * The product header component that displays textual information
 * - manufacturer
 * - shipping
 * - discount
 * - price
 * - price info
 * If not available or animating it will display placeholders
 * @returns {JSX}
 */
const ProductHeader = () => (
  <div className={styles.content}>
    <AddToCartButton />
    <Rating />
    <Name />
    <Manufacturer />
    <Grid component="div">
      <Grid.Item component="div" shrink={0} className={styles.infoContainer}>
        <PriceStriked />
        <Shipping />
        <Availability />
      </Grid.Item>
      <Grid.Item component="div" shrink={0} className={styles.priceContainer}>
        <Discount />
        <Price />
      </Grid.Item>
    </Grid>
    <Grid component="div">
      <Grid.Item component="div" shrink={0} className={styles.basePriceContainer}>
        <PriceInfo />
      </Grid.Item>
    </Grid>
  </div>
);

export default ProductHeader;
