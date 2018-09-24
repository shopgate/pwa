import React from 'react';
import PropTypes from 'prop-types';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import Iterator from './components/Iterator';
import Layout from './components/Layout';

/**
 * The Product List component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductList = ({
  flags,
  infiniteLoad,
  handleGetProducts,
  products,
  totalProductCount,
  requestHash,
}) => {
  if (!infiniteLoad) {
    return (
      <Layout>
        {products.map(product =>
          (<Iterator
            display={flags}
            id={product.id}
            key={product.id}
            {...product}
          />))}
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
      initialLimit={10}
      limit={ITEMS_PER_LOAD}
      requestHash={requestHash}
    />
  );
};

ProductList.propTypes = {
  flags: PropTypes.shape(),
  handleGetProducts: PropTypes.func,
  infiniteLoad: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
  requestHash: PropTypes.string,
  totalProductCount: PropTypes.number,
};

ProductList.defaultProps = {
  flags: null,
  handleGetProducts: () => {},
  infiniteLoad: true,
  products: null,
  requestHash: null,
  totalProductCount: null,
};

export default ProductList;
