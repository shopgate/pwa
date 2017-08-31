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
        <ProductHeaderShipping shipping={props.shipping} ready={props.placeholderShippingReady} />
        <ProductHeaderAvailability availability={props.product.availability} ready={props.placeholderProductReady} />
      </Grid.Item>
      <Grid.Item component="div" shrink={0} className={styles.priceContainer}>
        <ProductHeaderDiscount price={props.product.price} ready={props.placeholderProductReady} />
        <ProductHeaderPrice price={props.product.price} ready={props.placeholderProductReady} />
      </Grid.Item>
    </Grid>
    <Grid component="div">
      <Grid.Item component="div" shrink={0} className={styles.basePriceContainer}>
        <ProductHeaderPriceInfo info={props.product.price.info} ready={props.placeholderProductReady} />
      </Grid.Item>
    </Grid>
  </div>
);

export default ProductHeader;
