import React from 'react';
import PropTypes from 'prop-types';
import { ProductListTypeProvider } from '@shopgate/engage/product';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { ViewContext } from '@shopgate/engage/components/View';
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
  scope,
}) => {
  if (!infiniteLoad) {
    return (
      <Layout>
        <ProductListTypeProvider type="productList" subType={scope}>
          {products.map(product =>
            (<Iterator
              display={flags}
              id={product.id}
              key={product.id}
              {...product}
            />))}
        </ProductListTypeProvider>
      </Layout>
    );
  }

  return (
    <ViewContext.Consumer>
      {({ getContentRef }) => (
        <ProductListTypeProvider type="productList" subType={scope}>
          <InfiniteContainer
            containerRef={getContentRef()}
            wrapper={Layout}
            iterator={Iterator}
            loader={handleGetProducts}
            items={products}
            loadingIndicator={<LoadingIndicator />}
            totalItems={totalProductCount}
            initialLimit={10}
            limit={ITEMS_PER_LOAD}
            requestHash={requestHash}
            enablePromiseBasedLoading
          />
        </ProductListTypeProvider>
      )}
    </ViewContext.Consumer>
  );
};

ProductList.propTypes = {
  flags: PropTypes.shape(),
  handleGetProducts: PropTypes.func,
  infiniteLoad: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
  requestHash: PropTypes.string,
  /**
   * Optional scope of the component. Will be used as subType property of the ProductListTypeContext
   * and is intended as a description in which "context" the component is used.
   * @default null
   */
  scope: PropTypes.string,
  totalProductCount: PropTypes.number,
};

ProductList.defaultProps = {
  flags: null,
  handleGetProducts: () => {},
  infiniteLoad: true,
  products: null,
  requestHash: null,
  totalProductCount: null,
  scope: null,
};

export default ProductList;
