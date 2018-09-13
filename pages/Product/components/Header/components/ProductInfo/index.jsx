import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_INFO,
  PRODUCT_INFO_AFTER,
  PRODUCT_INFO_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import Manufacturer from '../Manufacturer';
import Shipping from '../Shipping';
import Availability from '../Availability';
import PriceStriked from '../PriceStriked';
import Price from '../Price';
import PriceInfo from '../PriceInfo';
import Tiers from '../Tiers';
import TaxDisclaimer from '../TaxDisclaimer';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductInfo = ({ productId, options }) => (
  <Fragment>
    <Portal name={PRODUCT_INFO_BEFORE} />
    <Portal name={PRODUCT_INFO}>
      <Grid component="div">
        <Grid.Item component="div" grow={1}>
          <div className={styles.productInfo}>
            <Manufacturer productId={productId} />
          </div>
          <div className={styles.productInfo}>
            <Shipping productId={productId} />
          </div>
          <div className={styles.productInfo}>
            <Availability productId={productId} />
          </div>
        </Grid.Item>
        <Grid.Item component="div" className={styles.priceContainer}>
          <div className={styles.priceInfo}>
            <PriceStriked productId={productId} options={options} />
          </div>
          <div className={styles.priceInfo}>
            <Price productId={productId} options={options} />
          </div>
          <div className={styles.priceInfo}>
            <PriceInfo productId={productId} options={options} />
          </div>
          <div className={styles.priceInfo}>
            <Tiers productId={productId} options={options} />
          </div>
        </Grid.Item>
        <TaxDisclaimer />
      </Grid>
    </Portal>
    <Portal name={PRODUCT_INFO_AFTER} />
  </Fragment>
);

ProductInfo.propTypes = {
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
};

export default pure(ProductInfo);
