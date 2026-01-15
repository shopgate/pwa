import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import {
  MapPriceHint,
  EffectivityDates,
  Availability,
} from '@shopgate/engage/product';
import {
  ResponsiveContainer,
  Grid,
  Portal,
} from '@shopgate/engage/components';
import {
  Shipping,
  PriceStriked,
  Tiers,
} from '@shopgate/engage/product/components/Header';
import {
  ProductInfoBackInStockButton,
} from '@shopgate/engage/back-in-stock/components';
import {
  PRODUCT_INFO,
  PRODUCT_INFO_AFTER,
  PRODUCT_INFO_BEFORE,
  PRODUCT_INFO_ROW1,
  PRODUCT_INFO_ROW2,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import Manufacturer from '../Manufacturer';
import Price from '../Price';
import PriceInfo from '../PriceInfo';
import TaxDisclaimer from '../TaxDisclaimer';
import StockInfo from '../StockInfo';
import connect from './connector';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ProductInfo = ({ productId, options, isROPEActive }) => (
  <>
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
              {!isROPEActive && (
                <Shipping productId={productId} />
              )}
            </div>
            <div className={styles.productInfo}>
              {/* This feature is currently in BETA testing.
                  It should only be used for approved BETA Client Projects */}
              {!isROPEActive && (
                <EffectivityDates productId={productId}>
                  <Availability productId={productId} />
                </EffectivityDates>
              )}
            </div>
            {!isROPEActive &&
              <div className={styles.productInfo}>
                <StockInfo productId={productId} />
              </div>}
          </Portal>
        </Grid.Item>
        <ResponsiveContainer breakpoint="xs" appAlways>
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
        </ResponsiveContainer>
        <TaxDisclaimer />
      </Grid>
      <Grid.Item component="div" className={styles.backInStockButton}>
        <ProductInfoBackInStockButton />
      </Grid.Item>
    </Portal>
    <Portal name={PRODUCT_INFO_AFTER} />
  </>
);

ProductInfo.propTypes = {
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  isROPEActive: PropTypes.bool,
};

ProductInfo.defaultProps = {
  isROPEActive: false,
};

export default connect(memo(ProductInfo));
