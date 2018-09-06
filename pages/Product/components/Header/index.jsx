import React from 'react';
import pure from 'recompose/pure';
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
import { ProductContext } from './../../context';

/**
 * The ProductHeader component.
 * @returns {JSX}
 */
const ProductHeader = () => (
  <ProductContext.Consumer>
    {({
      productId,
      variantId,
      options,
    }) => {
      const id = variantId || productId;
      return (
        <div className={styles.content}>
          {/* CTAs */}
          <Portal name={portals.PRODUCT_CTAS_BEFORE} />
          <Portal name={portals.PRODUCT_CTAS}>
            <CTAButtons productId={id} />
          </Portal>
          <Portal name={portals.PRODUCT_CTAS_AFTER} />

          {/* RATING */}
          <Portal name={portals.PRODUCT_RATING_BEFORE} />
          <Portal name={portals.PRODUCT_RATING}>
            <Rating productId={productId} />
          </Portal>
          <Portal name={portals.PRODUCT_RATING_AFTER} />

          {/* NAME */}
          <Portal name={portals.PRODUCT_NAME_BEFORE} />
          <Portal name={portals.PRODUCT_NAME}>
            <Name productId={id} />
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
                      <Manufacturer productId={id} />
                    </Portal>
                    <Portal name={portals.PRODUCT_MANUFACTURER_AFTER} />
                  </div>

                  {/* SHIPPING */}
                  <div className={styles.productInfo}>
                    <Portal name={portals.PRODUCT_SHIPPING_BEFORE} />
                    <Portal name={portals.PRODUCT_SHIPPING}>
                      <Shipping productId={id} />
                    </Portal>
                    <Portal name={portals.PRODUCT_SHIPPING_AFTER} />
                  </div>

                  {/* AVAILABILITY */}
                  <div className={styles.productInfo}>
                    <Portal name={portals.PRODUCT_AVAILABILITY_BEFORE} />
                    <Portal name={portals.PRODUCT_AVAILABILITY}>
                      <Availability productId={id} />
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
                      <PriceStriked productId={id} options={options} />
                    </Portal>
                    <Portal name={portals.PRODUCT_PRICE_STRIKED_AFTER} />
                  </div>

                  {/* PRICE */}
                  <div className={styles.priceInfo}>
                    <Portal name={portals.PRODUCT_PRICE_BEFORE} />
                    <Portal name={portals.PRODUCT_PRICE}>
                      <Price productId={id} options={options} />
                    </Portal>
                    <Portal name={portals.PRODUCT_PRICE_AFTER} />
                  </div>

                  {/* PRICE INFO */}
                  <div className={styles.priceInfo}>
                    <Portal name={portals.PRODUCT_PRICE_INFO_BEFORE} />
                    <Portal name={portals.PRODUCT_PRICE_INFO}>
                      <PriceInfo productId={id} options={options} />
                    </Portal>
                    <Portal name={portals.PRODUCT_PRICE_INFO_AFTER} />
                  </div>

                  {/* TIER PRICES */}
                  <div className={styles.priceInfo}>
                    <Portal name={portals.PRODUCT_TIERS_BEFORE} />
                    <Portal name={portals.PRODUCT_TIERS}>
                      <Tiers productId={id} options={options} />
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
      }
    }
  </ProductContext.Consumer>
);

export default pure(ProductHeader);
