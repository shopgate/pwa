/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Portal from '@shopgate/pwa-common/components/Portal';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { PRODUCT_ITEM_NAME_BEFORE } from '@shopgate/pwa-common-commerce/product/constants/portals';
import ProductImage from 'Components/ProductImage';
import DiscountBadge from 'Components/DiscountBadge';
import Price from 'Components/Price';
import PriceStriked from 'Components/PriceStriked';
import PriceInfo from 'Components/PriceInfo';
import FavoritesButton from 'Components/FavoritesButton';
import styles from './style';
import connect from './connector';

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ product, display, isFavorite }) => (
  <Link
    tagName="a"
    href={`/item/${bin2hex(product.id)}`}
    className={styles.container}
    itemProp="item"
    itemScope
    itemType="http://schema.org/Product"
  >
    <ProductImage itemProp="image" src={product.featuredImageUrl} alt={product.name} />
    {!!product.price.discount &&
      <div className={styles.badgeWrapper}>
        <DiscountBadge text={`-${product.price.discount}%`} />
      </div>
    }
    <div className={styles.favorites}>
      <FavoritesButton active={isFavorite} productId={product.id} noShadow />
    </div>
    {(!display || display.name || display.price || display.reviews) && (
      <div className={styles.details}>
        <Portal name={PRODUCT_ITEM_NAME_BEFORE} props={{ id: product.id }} />
        {(!display || display.name) && (
          <div className={styles.title} itemProp="name">
            <Ellipsis>{product.name}</Ellipsis>
          </div>
        )}
        {(!display || display.price) && (
          <Grid className={styles.priceWrapper} wrap>
            <Grid.Item grow={1}>
              <Price
                unitPrice={product.price.unitPrice}
                unitPriceMin={product.price.unitPriceMin}
                discounted={!!product.price.discount}
                currency={product.price.currency}
              />
            </Grid.Item>
            {product.price.msrp > 0 && (
              <Grid.Item>
                <PriceStriked
                  value={product.price.msrp}
                  currency={product.price.currency}
                />
              </Grid.Item>
            )}
            {(!product.price.msrp && product.price.unitPriceStriked > 0) && (
              <Grid.Item>
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

export default connect(Item);
