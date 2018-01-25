/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import CardItem from 'Components/CardList/components/Item';
import ProductCharacteristics from 'Components/ProductCharacteristics';
import Grid from '@shopgate/pwa-common/components/Grid';
import ProductImage from 'Components/ProductImage';
import AvailableText from 'Components/Availability';
import Price from './components/Price';
import styles from '../../style';

/**
 * Renders Favorites list item.
 * @param {Object} product Product.
 * @returns {XML}
 */
const Item = ({ product }) => (
  <CardItem key={product.id}>
    <Grid className={styles.row}>
      <Grid.Item className={styles.leftColumn}>
        <div className={styles.image}>
          <Link
            tagName="a"
            href={`/item/${bin2hex(product.id)}`}
            itemProp="item"
            itemScope
            itemType="http://schema.org/Product"
          >
            <ProductImage src={product.featuredImageUrl} />
          </Link>
        </div>
      </Grid.Item>
      <Grid.Item grow={1} className={styles.rightColumn}>
        <div className={styles.name}>
          <Link
            tagName="a"
            href={`/item/${bin2hex(product.id)}`}
            itemProp="item"
            itemScope
            itemType="http://schema.org/Product"
          >
            {product.name}
          </Link>
        </div>
        <div className={styles.details}>
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
        </div>
      </Grid.Item>
    </Grid>
  </CardItem>
);

Item.prototype.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default Item;
