/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Iterator from 'Components/ProductGrid/components/Iterator';
import Layout from 'Components/ProductGrid/components/Layout';

/**
 * The product grid widget component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductGridWidget = ({ products, flags }) => (
  <Layout>
    {products.map(product =>
      <Iterator {...product} display={flags} key={product.id} />
    )}
  </Layout>
);

ProductGridWidget.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  flags: PropTypes.shape(),
};

ProductGridWidget.defaultProps = {
  flags: {},
};

export default ProductGridWidget;
