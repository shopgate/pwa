/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import ProductImage from 'Components/ProductImage';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import styles from './style';

/**
 *
 * @param {Object} product Product data
 * @constructor
 */
const Image = ({ product }) => (
  <div className={styles.image}>
    <Link
      tagName="a"
      href={`/item/${bin2hex(product.baseProductId || product.id)}`}
      itemProp="item"
      itemScope
      itemType="http://schema.org/Product"
    >
      <ProductImage src={product.featuredImageUrl} />
    </Link>
  </div>
);

Image.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default Image;
