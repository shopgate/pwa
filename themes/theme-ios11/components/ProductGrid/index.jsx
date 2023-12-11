import React from 'react';
import PropTypes from 'prop-types';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { ProductListTypeProvider } from '@shopgate/engage/product';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { useWidgetSettings } from '@shopgate/engage/core';
import { ViewContext } from '@shopgate/engage/components/View';
import Iterator from './components/Iterator';
import Layout from './components/Layout';

export const WIDGET_ID = '@shopgate/engage/product/ProductGrid';

/**
 * The Product Grid component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductGrid = ({
  flags,
  infiniteLoad,
  handleGetProducts,
  products,
  totalProductCount,
  requestHash,
  scope,
}) => {
  const { columns = 2 } = useWidgetSettings(WIDGET_ID) || {};

  if (!infiniteLoad) {
    return (
      <Layout columns={columns}>
        <ProductListTypeProvider type="productGrid" subType={scope}>
          {products.map(product => (
            <Iterator
              display={flags}
              id={product.id}
              key={product.id}
              {...product}
            />
          ))}
        </ProductListTypeProvider>
      </Layout>
    );
  }

  return (
    <ViewContext.Consumer>
      {({ getContentRef }) => (
        <ProductListTypeProvider type="productGrid" subType={scope}>
          <InfiniteContainer
            containerRef={getContentRef()}
            wrapper={props => (
              <Layout
                columns={columns}
                {...props}
              />
            )}
            iterator={Iterator}
            loader={handleGetProducts}
            items={products}
            loadingIndicator={<LoadingIndicator />}
            totalItems={totalProductCount}
            initialLimit={ITEMS_PER_LOAD}
            limit={ITEMS_PER_LOAD}
            requestHash={requestHash}
            enablePromiseBasedLoading
          />
        </ProductListTypeProvider>
      )}
    </ViewContext.Consumer>
  );
};

ProductGrid.propTypes = {
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

ProductGrid.defaultProps = {
  flags: null,
  handleGetProducts: () => { },
  infiniteLoad: true,
  products: null,
  requestHash: null,
  totalProductCount: null,
  scope: null,
};

export default ProductGrid;
