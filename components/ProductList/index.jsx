/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from 'Components/LoadingIndicator';
import Iterator from './components/Iterator';
import Layout from './components/Layout';

/**
 * The Product List component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductList = ({ handleGetProducts, products, totalProductCount, viewId }) => (
  <InfiniteContainer
    wrapper={Layout}
    iterator={Iterator}
    loader={handleGetProducts}
    items={products}
    loadingIndicator={LoadingIndicator}
    totalItems={totalProductCount}
    viewId={viewId}
    key={viewId}
    initialLimit={10}
  />
);

ProductList.propTypes = {
  totalProductCount: PropTypes.number.isRequired,
  viewId: PropTypes.string.isRequired,
  handleGetProducts: PropTypes.func,
  products: PropTypes.arrayOf(PropTypes.shape()),
};

ProductList.defaultProps = {
  handleGetProducts: () => {},
  products: null,
};

export default ProductList;
