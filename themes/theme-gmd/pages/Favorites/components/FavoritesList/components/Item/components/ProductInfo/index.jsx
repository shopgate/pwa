import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal, Grid, Link, Availablity as AvailableText } from '@shopgate/engage/components';
import {
  FAVORITES_PRODUCT_NAME_BEFORE,
  FAVORITES_PRODUCT_NAME,
  FAVORITES_PRODUCT_NAME_AFTER,
  FAVORITES_AVAILABILITY_TEXT_BEFORE,
  FAVORITES_AVAILABILITY_TEXT,
  FAVORITES_AVAILABILITY_TEXT_AFTER,
  FAVORITES_PRODUCT_PRICE_BEFORE,
  FAVORITES_PRODUCT_PRICE,
  FAVORITES_PRODUCT_PRICE_AFTER,
} from '@shopgate/engage/favorites';
import { bin2hex } from '@shopgate/engage/core';
import { ITEM_PATH } from '@shopgate/engage/product';
import Characteristics from './components/Characteristics';
import Price from './components/Price';
import styles from './style';

/**
 * ProductInfo component
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductInfo = ({ product }) => {
  const props = { product };
  const {
    availability,
    characteristics,
    id,
    name,
    price,
  } = product;

  return (
    <Fragment>
      <Portal name={FAVORITES_PRODUCT_NAME_BEFORE} props={props} />
      <Portal name={FAVORITES_PRODUCT_NAME} props={props}>
        <div className={styles.name} data-test-id={`favoriteListItem: ${name}`}>
          <Link
            tagName="a"
            href={`${ITEM_PATH}/${bin2hex(id)}`}
            itemProp="item"
            itemScope
            itemType="http://schema.org/Product"
            state={{
              title: name,
            }}
          >
            {name}
          </Link>
        </div>
      </Portal>
      <Portal name={FAVORITES_PRODUCT_NAME_AFTER} props={props} />
      <Grid className={styles.detailsRow}>
        <Grid.Item className={styles.propertiesContainer}>
          {characteristics && <Characteristics characteristics={characteristics} />}
          <Portal name={FAVORITES_AVAILABILITY_TEXT_BEFORE} props={props} />
          <Portal name={FAVORITES_AVAILABILITY_TEXT} props={props}>
            <AvailableText
              text={availability.text}
              state={availability.state}
              showWhenAvailable
            />
          </Portal>
          <Portal name={FAVORITES_AVAILABILITY_TEXT_AFTER} props={props} />
        </Grid.Item>
        <Grid.Item className={styles.priceContainer}>
          <Portal name={FAVORITES_PRODUCT_PRICE_BEFORE} props={props} />
          <Portal name={FAVORITES_PRODUCT_PRICE} props={props}>
            <Price price={price} />
          </Portal>
          <Portal name={FAVORITES_PRODUCT_PRICE_AFTER} props={props} />
        </Grid.Item>
      </Grid>
    </Fragment>
  );
};

ProductInfo.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default ProductInfo;
