/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from 'Components/LoadingIndicator';
import Iterator from './components/Iterator';
import Layout from './components/Layout';

/**
 * The Product Grid component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductGrid = ({
  flags, infiniteLoad, handleGetProducts, products, totalProductCount,
}) => {
  if (!infiniteLoad) {
    return (
      <Layout>
        {products.map(product => (
          <Iterator
            display={flags}
            id={product.id}
            key={product.id}
            {...product}
          />
        ))}
      </Layout>
    );
  }

  return (
    <InfiniteContainer
      wrapper={Layout}
      iterator={Iterator}
      loader={handleGetProducts}
      items={products}
      loadingIndicator={<LoadingIndicator />}
      totalItems={totalProductCount}
      initialLimit={6}
      limit={ITEMS_PER_LOAD}
    />
  );
};

ProductGrid.propTypes = {
  flags: PropTypes.shape(),
  handleGetProducts: PropTypes.func,
  infiniteLoad: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
  totalProductCount: PropTypes.number,
};

ProductGrid.defaultProps = {
  flags: null,
  handleGetProducts: () => {},
  infiniteLoad: true,
  products: null,
  totalProductCount: null,
};

export default ProductGrid;
