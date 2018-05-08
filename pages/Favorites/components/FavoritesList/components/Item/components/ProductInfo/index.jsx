import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import ProductCharacteristics from '@shopgate/pwa-ui-shared/ProductCharacteristics';
import AvailableText from '@shopgate/pwa-ui-shared/Availability';
import Price from './components/Price';
import styles from './style';

/**
 * ProductInfo component
 * @param {Object} product Product data.
 * @constructor
 */
const ProductInfo = ({ product }) => (
  <Fragment>
    <div className={styles.name}>
      <Link
        tagName="a"
        href={`${ITEM_PATH}/${bin2hex(product.baseProductId || product.id)}`}
        itemProp="item"
        itemScope
        itemType="http://schema.org/Product"
      >
        {product.name}
      </Link>
    </div>
    <Grid className={styles.detailsRow}>
      <Grid.Item className={styles.propertiesContainer}>
        <ProductCharacteristics characteristics={product.characteristics} />
        <AvailableText
          text={product.availability.text}
          state={product.availability.state}
          showWhenAvailable
        />
      </Grid.Item>
      <Grid.Item className={styles.priceContainer}>
        <Price price={product.price} />
      </Grid.Item>
    </Grid>
  </Fragment>
);

ProductInfo.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default ProductInfo;
