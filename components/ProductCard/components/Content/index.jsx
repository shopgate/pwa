/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../style';

const Content = ({ product, hidePrice, hideRating, hideName, titleRows }) => {
  if (hidePrice && hideRating) {
    return null;
  }

  return (
    <div className={styles.details}>
      {(!hideRating && product.rating && product.rating.count) && (
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
          {product.price.unitPriceStriked && (
            <Grid.Item>
              <PriceStriked
                value="{product.price.unitPriceStriked}"
                currency="{product.price.currency}"
                className={styles.striked}
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
  )
};

export default Content;
