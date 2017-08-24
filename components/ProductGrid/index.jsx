/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from 'Components/LoadingIndicator';
import Iterator from './components/Iterator';
import Layout from './components/Layout';

/**
 * The category list component.
 * @param {Array} categories The categories to display.
 * @returns {JSX}
 */
const ProductGrid = pure(({ handleGetProducts, products, totalProductCount, viewId }) => (
  <InfiniteContainer
    wrapper={Layout}
    iterator={Iterator}
    loader={handleGetProducts}
    items={products}
    loadingIndicator={LoadingIndicator}
    totalItems={totalProductCount}
    viewId={viewId}
    key={viewId}
    initialLimit={6}
  />
));

ProductGrid.propTypes = {
  totalProductCount: PropTypes.number.isRequired,
  viewId: PropTypes.string.isRequired,
  handleGetProducts: PropTypes.func,
  products: PropTypes.arrayOf(PropTypes.shape()),
};

ProductGrid.defaultProps = {
  handleGetProducts: () => {},
  products: null,
};

export default ProductGrid;
