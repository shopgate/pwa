import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { MapPriceHint, OrderQuantityHint, EffectivityDates } from '@shopgate/engage/product';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_INFO,
  PRODUCT_INFO_AFTER,
  PRODUCT_INFO_BEFORE,
  PRODUCT_INFO_ROW1,
  PRODUCT_INFO_ROW2,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import Shipping from '@shopgate/engage/product/components/Header/Shipping';
import Tiers from '@shopgate/engage/product/components/Header/Tiers';
import PriceStriked from '@shopgate/engage/product/components/Header/PriceStriked';
import { ProductInfoBackInStockButton } from '@shopgate/engage/back-in-stock/components';
import Manufacturer from '../Manufacturer';
import Availability from '../Availability';
import Price from '../Price';
import PriceInfo from '../PriceInfo';
import TaxDisclaimer from '../TaxDisclaimer';
import StockInfo from '../StockInfo';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductInfo = ({ productId, options }) => (
  <Fragment>
    <Portal name={PRODUCT_INFO_BEFORE} />
    <Portal name={PRODUCT_INFO}>
      <Grid component="div" className="theme__product__header__product-info">
        <Grid.Item component="div" grow={1} className="theme__product__header__product-info__row1">
          <Portal name={PRODUCT_INFO_ROW1}>
            <div className={styles.productInfo}>
              {/* This feature is currently in BETA testing.
              It should only be used for approved BETA Client Projects */}
              <MapPriceHint productId={productId} />
            </div>
            <div className={styles.productInfo}>
              <Manufacturer productId={productId} />
            </div>
            <div className={styles.productInfo}>
              <Shipping productId={productId} />
            </div>
            <div className={styles.productInfo}>
              {/* This feature is currently in BETA testing.
              It should only be used for approved BETA Client Projects */}
              <OrderQuantityHint productId={productId} />
            </div>
            <div className={styles.productInfo}>
              {/* This feature is currently in BETA testing.
                It should only be used for approved BETA Client Projects */}
              <EffectivityDates productId={productId}>
                <Availability productId={productId} />
              </EffectivityDates>
            </div>
            <div className={styles.productInfo}>
              <StockInfo productId={productId} />
            </div>
          </Portal>
        </Grid.Item>
        <Grid.Item component="div" className={`${styles.priceContainer} theme__product__header__product-info__row2`}>
          <Portal name={PRODUCT_INFO_ROW2}>
            <div>
              <PriceStriked productId={productId} options={options} />
            </div>
            <div>
              <Price productId={productId} options={options} />
            </div>
            <div>
              <PriceInfo productId={productId} options={options} />
            </div>
            <div>
              <Tiers productId={productId} options={options} />
            </div>
          </Portal>
        </Grid.Item>
        <TaxDisclaimer />
      </Grid>
      <Grid.Item component="div" className={styles.backInStockButton}>
        <ProductInfoBackInStockButton />
      </Grid.Item>
    </Portal>
    <Portal name={PRODUCT_INFO_AFTER} />
  </Fragment>
);

ProductInfo.propTypes = {
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
};

export default memo(ProductInfo);
