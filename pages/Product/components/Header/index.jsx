/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
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
    {/* CTAs */}
    <Portal name={portals.PRODUCT_CTAS_BEFORE} />
    <Portal name={portals.PRODUCT_CTAS}>
      <CTAButtons />
    </Portal>
    <Portal name={portals.PRODUCT_CTAS_AFTER} />

    {/* RATING */}
    <Portal name={portals.PRODUCT_RATING_BEFORE} />
    <Portal name={portals.PRODUCT_RATING}>
      <Rating />
    </Portal>
    <Portal name={portals.PRODUCT_RATING_AFTER} />

    {/* NAME */}
    <Portal name={portals.PRODUCT_NAME_BEFORE} />
    <Portal name={portals.PRODUCT_NAME}>
      <Name />
    </Portal>
    <Portal name={portals.PRODUCT_NAME_AFTER} />

    {/* INFO */}
    <Portal name={portals.PRODUCT_INFO_BEFORE} />
    <Grid component="div">
      <Portal name={portals.PRODUCT_INFO}>
        <Grid.Item component="div" grow={1}>
          <Portal name={portals.PRODUCT_INFO_ROW1}>

            {/* MANUFACTURER */}
            <div className={styles.productInfo}>
              <Portal name={portals.PRODUCT_MANUFACTURER_BEFORE} />
              <Portal name={portals.PRODUCT_MANUFACTURER}>
                <Manufacturer />
              </Portal>
              <Portal name={portals.PRODUCT_MANUFACTURER_AFTER} />
            </div>

            {/* SHIPPING */}
            <div className={styles.productInfo}>
              <Portal name={portals.PRODUCT_SHIPPING_BEFORE} />
              <Portal name={portals.PRODUCT_SHIPPING}>
                <Shipping />
              </Portal>
              <Portal name={portals.PRODUCT_SHIPPING_AFTER} />
            </div>

            {/* AVAILABILITY */}
            <div className={styles.productInfo}>
              <Portal name={portals.PRODUCT_AVAILABILITY_BEFORE} />
              <Portal name={portals.PRODUCT_AVAILABILITY}>
                <Availability />
              </Portal>
              <Portal name={portals.PRODUCT_AVAILABILITY_AFTER} />
            </div>

          </Portal>
        </Grid.Item>
        <Grid.Item component="div" className={styles.priceContainer}>
          <Portal name={portals.PRODUCT_INFO_ROW2}>

            {/* PRICE STRIKED */}
            <div className={styles.priceInfo}>
              <Portal name={portals.PRODUCT_PRICE_STRIKED_BEFORE} />
              <Portal name={portals.PRODUCT_PRICE_STRIKED}>
                <PriceStriked />
              </Portal>
              <Portal name={portals.PRODUCT_PRICE_STRIKED_AFTER} />
            </div>

            {/* PRICE */}
            <div className={styles.priceInfo}>
              <Portal name={portals.PRODUCT_PRICE_BEFORE} />
              <Portal name={portals.PRODUCT_PRICE}>
                <Price />
              </Portal>
              <Portal name={portals.PRODUCT_PRICE_AFTER} />
            </div>

            {/* PRICE INFO */}
            <div className={styles.priceInfo}>
              <Portal name={portals.PRODUCT_PRICE_INFO_BEFORE} />
              <Portal name={portals.PRODUCT_PRICE_INFO}>
                <PriceInfo />
              </Portal>
              <Portal name={portals.PRODUCT_PRICE_INFO_AFTER} />
            </div>

            {/* TIER PRICES */}
            <div className={styles.priceInfo}>
              <Portal name={portals.PRODUCT_TIERS_BEFORE} />
              <Portal name={portals.PRODUCT_TIERS}>
                <Tiers />
              </Portal>
              <Portal name={portals.PRODUCT_TIERS_AFTER} />
            </div>

          </Portal>
        </Grid.Item>
        {showTaxDisclaimer && (
          <Grid.Item
            className={styles.disclaimerSpacer}
            component="div"
            grow={0}
            shrink={0}
          />
        )}
      </Portal>
    </Grid>
    <Portal name={portals.PRODUCT_INFO_AFTER} />
  </div>
);

export default ProductHeader;
