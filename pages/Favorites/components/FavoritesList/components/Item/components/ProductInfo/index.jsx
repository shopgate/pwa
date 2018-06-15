import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
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
    <Portal name={portals.FAVORITES_PRODUCT_NAME_BEFORE} props={{ product }} />
    <Portal name={portals.FAVORITES_PRODUCT_NAME} props={{ product }} >
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
    </Portal>
    <Portal name={portals.FAVORITES_PRODUCT_NAME_AFTER} props={{ product }} />
    <Grid className={styles.detailsRow}>
      <Grid.Item className={styles.propertiesContainer}>
        <Portal name={portals.FAVORITES_PRODUCT_CHARACTERISTICS_BEFORE} props={{ product }} />
        <Portal name={portals.FAVORITES_PRODUCT_CHARACTERISTICS} props={{ product }}>
          <ProductCharacteristics characteristics={product.characteristics} />
        </Portal>
        <Portal name={portals.FAVORITES_PRODUCT_CHARACTERISTICS_AFTER} props={{ product }} />
        <Portal name={portals.FAVORITES_AVAILABILITY_TEXT_BEFORE} props={{ product }} />
        <Portal name={portals.FAVORITES_AVAILABILITY_TEXT} props={{ product }}>
        <AvailableText
          text={product.availability.text}
          state={product.availability.state}
          showWhenAvailable
        />
        </Portal>
        <Portal name={portals.FAVORITES_AVAILABILITY_TEXT_AFTER} props={{ product} } />
      </Grid.Item>
      <Portal name={portals.FAVORITES_PRODUCT_PRICE_BEFORE} props={{ product }} />
      <Portal name={portals.FAVORITES_PRODUCT_PRICE_TEXT} props={{ product }}>
        <Grid.Item className={styles.priceContainer}>
          <Price price={product.price} />
        </Grid.Item>
      </Portal>
      <Portal name={portals.FAVORITES_PRODUCT_PRICE_AFTER} props={{ product }} />
    </Grid>
  </Fragment>
);

ProductInfo.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default ProductInfo;
