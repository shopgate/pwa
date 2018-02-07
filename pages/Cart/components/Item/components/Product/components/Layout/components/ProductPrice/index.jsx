/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Price from 'Components/Price';
import PriceStriked from 'Components/PriceStriked';
import styles from './style';

/**
 * The Cart Product Price component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductPrice = ({ currency, defaultPrice, specialPrice }) => (
  <Grid.Item
    component="div"
    shrink={0}
  >
    {!!specialPrice && (
      <PriceStriked
        className={styles.priceStriked}
        value={defaultPrice}
        currency={currency}
      />
    )}
    <Price
      className={styles.price}
      currency={currency}
      discounted={!!specialPrice}
      taxDisclaimer
      unitPrice={specialPrice || defaultPrice}
    />
  </Grid.Item>
);

ProductPrice.propTypes = {
  currency: PropTypes.string.isRequired,
  defaultPrice: PropTypes.number.isRequired,
  specialPrice: PropTypes.number,
};

ProductPrice.defaultProps = {
  specialPrice: null,
};

export default ProductPrice;
