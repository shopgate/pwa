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
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
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
    <Portal name={portals.PRODUCT_ITEM_IMAGE_BEFORE} props={{ productId: product.id }} />
    <Portal
      name={portals.PRODUCT_ITEM_IMAGE}
      props={{ productId: product.id }}
    >
      <ProductImage
        alt={product.name}
        itemProp="image"
        src={product.featuredImageUrl}
      />
    </Portal>
    <Portal name={portals.PRODUCT_ITEM_IMAGE_AFTER} props={{ productId: product.id }} />
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
        <Portal name={portals.PRODUCT_ITEM_NAME_BEFORE} props={{ productId: product.id }} />
        {(!display || display.name) && (
          <Portal name={portals.PRODUCT_ITEM_NAME} props={{ productId: product.id }}>
            <div className={styles.title} itemProp="name">
              <Ellipsis>{product.name}</Ellipsis>
            </div>
          </Portal>
        )}
        <Portal name={portals.PRODUCT_ITEM_NAME_AFTER} props={{ productId: product.id }} />
        <Portal name={portals.PRODUCT_ITEM_PRICE_BEFORE} props={{ productId: product.id }} />
        {(!display || display.price) && (
          <Portal name={portals.PRODUCT_ITEM_PRICE} props={{ productId: product.id }}>
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
          </Portal>
        )}
        <Portal name={portals.PRODUCT_ITEM_PRICE_AFTER} props={{ productId: product.id }} />
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
  isFavorite: PropTypes.bool.isRequired,
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default connect(Item);
