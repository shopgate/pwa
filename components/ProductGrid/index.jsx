/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import IndicatorCircle from 'Components/IndicatorCircle';
import LoadingIndicator from 'Components/LoadingIndicator';
import Iterator from './components/Iterator';
import Layout from './components/Layout';

/**
 * The category list component.
 * @param {Array} categories The categories to display.
 * @returns {JSX}
 */
const ProductGrid = ({ handleGetProducts, products, totalProductCount, viewId }) => {
  const loadingIndicator = (
    <LoadingIndicator>
      <IndicatorCircle />
    </LoadingIndicator>
  );

  return (
    <InfiniteContainer
      wrapper={Layout}
      iterator={Iterator}
      loader={handleGetProducts}
      items={products}
      loadingIndicator={loadingIndicator}
      totalItems={totalProductCount}
      viewId={viewId}
      key={viewId}
      initialLimit={6}
    />
  );
};

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape()),
};

ProductGrid.defaultProps = {
  products: null,
};

export default ProductGrid;
