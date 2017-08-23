/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
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
import FavoritesButton from 'Components/FavoritesButton';
import RatingStars from 'Components/RatingStars';
import PriceInfo from 'Components/PriceInfo';
import Price from 'Components/Price';
import PriceStriked from 'Components/PriceStriked';
import Discount from './components/Discount';
import Content from './components/Content';
import styles from './style';

/**
 * The ProductCard component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product data.
 * @param {boolean} props.hidePrice Whether the price should be hidden.
 * @param {[type]} props.hideRating Whether the rating should be hidden.
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
    <Discount hidePrice={hidePrice} discount={product.price.discount} />
    <FavoritesButton className={styles.wishlist} productId={product.id} />
    <Content
      product={product}
      hidePrice={hidePrice}
      hideRating={hideRating}
      hideName={hideName}
      titleRows={titleRows}
    />
  </Link>
);

ProductCard.propTypes = {
  hidePrice: PropTypes.bool.isRequired,
  hideRating: PropTypes.bool.isRequired,
  product: PropTypes.shape().isRequired,
};

export default ProductCard;
