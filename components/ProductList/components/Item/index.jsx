/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Image from '@shopgate/pwa-common/components/Image';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import DiscountBadge from 'Components/DiscountBadge';
import Price from 'Components/Price';
import PriceStriked from 'Components/PriceStriked';
import PriceInfo from 'Components/PriceInfo';
import Manufacturer from 'Components/Manufacturer';
import Availability from 'Components/Availability';
import styles from './style';

/**
 * The Product List Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ display, product }) => (
  <Link
    tagName="a"
    href={`/item/${bin2hex(product.id)}`}
    className={styles.container}
    itemProp="item"
    itemScope
    itemType="http://schema.org/Product"
  >
    <Grid className={styles.listItemContainer}>
      <Grid.Item shrink={0} className={styles.imageContainer}>
        <Image itemProp="image" src={product.featuredImageUrl} alt={product.name} />
        {product.price.discount && (
          <DiscountBadge text={`-${product.price.discount}%`} />
        )}
      </Grid.Item>
      <Grid.Item grow={4} className={styles.titleContainer}>
        <div itemProp="name">
          <Ellipsis>{product.name}</Ellipsis>
        </div>
        {(!display || (display.manufacturer && product.manufacturer)) && (
          <Manufacturer text={product.manufacturer} className={styles.manufacturer} />
        )}
        {product.availability && (
          <Availability
            className={styles.availability}
            text={product.availability.text}
            state={product.availability.state}
          />
        )}
      </Grid.Item>
      {(!display || display.price) && (
        <Grid.Item grow={1} className={styles.priceContainer}>
          <Price
            unitPrice={product.price.unitPrice}
            unitPriceMin={product.price.unitPriceMin}
            discounted={!!product.price.discount}
            currency={product.price.currency}
          />
          {product.price.unitPriceStriked > 0 && (
            <PriceStriked
              value={product.price.unitPriceStriked}
              currency={product.price.currency}
              className={styles.priceStriked}
            />
          )}
          {product.price.info && (
            <PriceInfo text={product.price.info} className={styles.priceInfo} />
          )}
        </Grid.Item>
      )}
      <Grid.Item shrink={0} className={styles.favouriteContainer} />
    </Grid>
  </Link>
);

Item.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default Item;
