/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import Grid from '@shopgate/pwa-common/components/Grid';
import ProductImage from 'Components/ProductImage';
// TODO: import FavoritesButton from 'Components/FavoritesButton';
import RatingStars from 'Components/RatingStars';
import PriceInfo from 'Components/PriceInfo';
import Price from 'Components/Price';
import DiscountBadge from 'Components/DiscountBadge';
import PriceStriked from 'Components/PriceStriked';
import styles from './style';

/**
 * The ProductCard component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product data.
 * @param {boolean} props.hidePrice Whether the price should be hidden.
 * @param {boolean} props.hideRating Whether the rating should be hidden.
 * @param {boolean} props.hideName Whether the name should be hidden.
 * @param {number} props.titleRows The max number of rows for the product title.
 * @return {JSX}
 */
const ProductCard = ({ product, hidePrice, hideRating, hideName, titleRows }) => (
  <Link
    tagName="a"
    href={`/item/${bin2hex(product.id)}`}
    className={styles.container}
    itemProp="item"
    itemScope
    itemType="http://schema.org/Product"
  >
    <ProductImage itemProp="image" src={product.featuredImageUrl} alt={product.name} />
    {!!(!hidePrice && product.price.discount) && (
      <div className={styles.badgeWrapper}>
        <DiscountBadge text={`-${product.price.discount}%`} />
      </div>
    )}
    {/* <FavoritesButton className={styles.wishlist} productId={product.id} /> */}
    {(!(hidePrice && hideRating)) && (
      <div className={styles.details}>
        {!hideRating && product.rating && product.rating.average > 0 && (
          <RatingStars value={product.rating.average} />
        )}
        {!hideName && (
          <div itemProp="name" className={styles.title}>
            <Ellipsis rows={titleRows || 3}>{product.name}</Ellipsis>
          </div>
        )}
        {!hidePrice && (
          <Grid className={styles.priceWrapper} wrap>
            <Grid.Item grow={1}>
              <Price
                unitPrice={product.price.unitPrice}
                unitPriceMin={product.price.unitPriceMin}
                discounted={!!product.price.discount}
                currency={product.price.currency}
              />
            </Grid.Item>
            {product.price.unitPriceStriked > 0 && (
              <Grid.Item>
                <PriceStriked
                  value={product.price.unitPriceStriked}
                  currency={product.price.currency}
                />
              </Grid.Item>
            )}
          </Grid>
        )}
        {(!hidePrice && product.price.info) && (
          <Grid>
            <Grid.Item>
              <PriceInfo className={styles.basicPrice} text={product.price.info} />
            </Grid.Item>
          </Grid>
        )}
      </div>
    )}
  </Link>
);

ProductCard.propTypes = {
  hideName: PropTypes.bool.isRequired,
  hidePrice: PropTypes.bool.isRequired,
  hideRating: PropTypes.bool.isRequired,
  product: PropTypes.shape().isRequired,
  titleRows: PropTypes.number.isRequired,
};

export default ProductCard;
