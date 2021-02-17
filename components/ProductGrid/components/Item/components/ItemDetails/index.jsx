import React from 'react';
import PropTypes from 'prop-types';
import {
  MapPriceHint,
  OrderQuantityHint,
  EffectivityDates,
  Swatches,
  getProductRoute,
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/engage/product';
import {
  TextLink, Link, Availability,
} from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';

import ItemName from '../ItemName';
import ItemPrice from '../ItemPrice';
import ShortDescription from '../ShortDescription';
import * as styles from './style';

/**
 * The item details component.
 * @returns {JSX}
 */
const ItemDetails = ({ product, display }) => {
  const {
    id: productId, name = null, stock = null, shortDescription = null,
  } = product;

  if (display && !display.name && !display.price && !display.reviews) {
    return null;
  }

  return (
    <div className={styles.details} tabIndex={-1} role="button">
      <Link
        href={getProductRoute(productId)}
        state={{ title: name }}
      >
        {/*
          This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects
        */}
        <Swatches productId={productId} />
      </Link>
      <TextLink
        href={getProductRoute(productId)}
        state={{ title: name }}
        className={styles.itemNameLink}
      >
        <ItemName display={display} productId={productId} name={name} />
      </TextLink>

      <Link
        tag="a"
        href={getProductRoute(productId)}
        state={{ title: name }}
        className={styles.propertiesLink}
      >
        <ShortDescription shortDescription={shortDescription} />

        {/*
          This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects
        */}
        <MapPriceHint productId={productId} />

        {/*
          This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects
        */}
        <OrderQuantityHint productId={productId} className={styles.quantityHint} />

        {/* This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects
        */}
        <EffectivityDates productId={productId} />

        <Availability
          state={!stock || stock.orderable
            ? AVAILABILITY_STATE_OK
            : AVAILABILITY_STATE_ALERT
          }
          text={i18n.text('product.available.not')}
          showWhenAvailable={false}
        />

        <div className={styles.itemPrice}>
          <ItemPrice product={product} display={display} />
        </div>
      </Link>
    </div>
  );
};

ItemDetails.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

ItemDetails.defaultProps = {
  display: null,
};

export default ItemDetails;
