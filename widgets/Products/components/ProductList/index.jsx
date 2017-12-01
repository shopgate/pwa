/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Iterator from 'Components/ProductList/components/Iterator';
import Layout from 'Components/ProductList/components/Layout';

/**
 * The product list widget component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductListWidget = ({ products, flags }) => (
  <Layout>
    {products.map(product =>
      <Iterator {...product} display={flags} key={product.id} />
    )}
  </Layout>
);

ProductListWidget.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  flags: PropTypes.shape(),
};

ProductListWidget.defaultProps = {
  flags: {},
};

export default ProductListWidget;
