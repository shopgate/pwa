import React, { Fragment, memo, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  MapPriceHint,
  OrderQuantityHint,
  EffectivityDates,
  Availability,
  ProductContext,
} from '@shopgate/engage/product';
import { ResponsiveContainer } from '@shopgate/engage/components';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_INFO,
  PRODUCT_INFO_AFTER,
  PRODUCT_INFO_BEFORE,
  PRODUCT_INFO_ROW1,
  PRODUCT_INFO_ROW2,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import Manufacturer from '../Manufacturer';
import Shipping from '../Shipping';
import PriceStriked from '../PriceStriked';
import Price from '../Price';
import PriceInfo from '../PriceInfo';
import Tiers from '../Tiers';
import TaxDisclaimer from '../TaxDisclaimer';
import StockInfo from '../StockInfo';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductInfo = ({ productId, options }) => {
  const { fulfillmentMethods } = useContext(ProductContext);

  return (
    <Fragment>
      <Portal name={PRODUCT_INFO_BEFORE} />
      <Portal name={PRODUCT_INFO}>
        <Grid component="div">
          <Grid.Item component="div" grow={1}>
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
                {!fulfillmentMethods && (
                  <EffectivityDates productId={productId}>
                    <Availability productId={productId} />
                  </EffectivityDates>
                )}
              </div>
              {!fulfillmentMethods &&
              <div className={styles.productInfo}>
                <StockInfo productId={productId} />
              </div>
              }
            </Portal>
          </Grid.Item>
          <ResponsiveContainer breakpoint="xs" appAlways>
            <Grid.Item component="div" className={styles.priceContainer}>
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
      </Portal>
      <Portal name={PRODUCT_INFO_AFTER} />
    </Fragment>
  );
};

ProductInfo.propTypes = {
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
};

export default memo(ProductInfo);
