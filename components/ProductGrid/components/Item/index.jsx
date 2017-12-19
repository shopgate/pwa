/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { hasReviews } from 'Config/app.json';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import ProductImage from 'Components/ProductImage';
import RatingStars from 'Components/RatingStars';
import DiscountBadge from 'Components/DiscountBadge';
import Price from 'Components/Price';
import PriceStriked from 'Components/PriceStriked';
import PriceInfo from 'Components/PriceInfo';
import styles from './style';

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ product, display }) => (
  <Link
    tagName="a"
    href={`/item/${bin2hex(product.id)}`}
    className={styles.container}
    itemProp="item"
    itemScope
    itemType="http://schema.org/Product"
  >
    <ProductImage itemProp="image" src={product.featuredImageUrl} alt={product.name} />
    {product.price.discount &&
      <div className={styles.badgeWrapper}>
        <DiscountBadge text={`-${product.price.discount}%`} />
      </div>
    }
    {(!display || display.name || display.price || display.reviews) && (
      <div className={styles.details}>
        {(hasReviews && product.rating && product.rating.count > 0) &&
          <div>
            {(!display || display.reviews) && <RatingStars value={product.rating.average} />}
          </div>
        }
        {(!display || display.name) && (
          <div className={styles.title} itemProp="name">
            <Ellipsis>{product.name}</Ellipsis>
          </div>
        )}
        {(!display || display.price) && (
          <Grid className={styles.priceWrapper} wrap>
            <Grid.Item grow={3}>
              <Price
                unitPrice={product.price.unitPrice}
                unitPriceMin={product.price.unitPriceMin}
                discounted={!!product.price.discount}
                currency={product.price.currency}
              />
            </Grid.Item>
            {product.price.unitPriceStriked > 0 && (
              <Grid.Item grow={2}>
                <PriceStriked
                  value={product.price.unitPriceStriked}
                  currency={product.price.currency}
                />
              </Grid.Item>
            )}
          </Grid>
        )}
        {(!display || display.price) && (
          <Grid>
            {product.price.info && (
              <Grid.Item>
                <PriceInfo className={styles.basicPrice} text={product.price.info} />
              </Grid.Item>
            )}
          </Grid>
        )}
      </div>
    )}
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
