import React from 'react';
import PropTypes from 'prop-types';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import InfiniteContainer from '@shopgate/pwa-common/components/InfiniteContainer';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { useWidgetSettings } from '@shopgate/engage/core';
import { ViewContext } from '@shopgate/engage/components/View';
import { ProductListTypeProvider } from '@shopgate/engage/product';
import Iterator from './components/Iterator';
import Layout from './components/Layout';

export const WIDGET_ID = '@shopgate/engage/product/ProductGrid';

/**
 * Resolves the infinite-scroll loading indicator from optional Redux-driven fetch state.
 * @param {boolean|undefined} resultIsFetching Redux isFetching when wired; else undefined.
 * @param {Array} products Current product list.
 * @param {number|null|undefined} totalProductCount Total count from the store.
 * @param {string|null|undefined} requestHash Result hash for the list request.
 * @returns {JSX.Element|null}
 */
const getListLoadingIndicator = (resultIsFetching, products, totalProductCount, requestHash) => {
  if (typeof resultIsFetching !== 'boolean') {
    return <LoadingIndicator />;
  }
  const waitingForFirstPayload =
    !products.length && totalProductCount === null && !!requestHash;
  if (resultIsFetching || waitingForFirstPayload) {
    return <LoadingIndicator />;
  }
  return null;
};

/**
 * The Product Grid component.
 * @param {Object} props The component props.
 * @param {Array} props.products The list of products to display.
 * @param {string} props.scope Optional scope of the component. Will be used as subType property of
 * the ProductListTypeContext and is intended as a description in which "context" the component is
 * used.
 * @param {Object} props.meta Optional metadata for the product list type context.
 * @param {Object} props.flags The flags object.
 * @param {boolean} props.flags.name Whether to display product names.
 * @param {boolean} props.flags.price Whether to display product prices.
 * @param {boolean} props.flags.reviews Whether to display rating stars.
 * @param {boolean} props.infiniteLoad Whether the grid should support infinite loading.
 * @param {Function} props.handleGetProducts Callback function that's invoked to load more products
 * when infinite loading is enabled.
 * @param {number} props.totalProductCount The total number of products. Needed when infinite
 * loading is enabled.
 * @param {string} props.requestHash The hash for the current request. Needed when infinite loading
 * is enabled
 * @returns {JSX.Element}
 */
const ProductGrid = ({
  flags,
  infiniteLoad,
  handleGetProducts,
  products,
  totalProductCount,
  requestHash,
  scope,
  meta,
  resultIsFetching,
}) => {
  const { columns = 2 } = useWidgetSettings(WIDGET_ID) || {};
  const listLoadingIndicator = getListLoadingIndicator(
    resultIsFetching,
    products,
    totalProductCount,
    requestHash
  );

  if (!infiniteLoad) {
    return (
      <Layout columns={columns}>
        <ProductListTypeProvider type="productGrid" subType={scope} meta={meta}>
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
        <ProductListTypeProvider type="productGrid" subType={scope} meta={meta}>
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
            loadingIndicator={listLoadingIndicator}
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
  flags: PropTypes.shape({
    name: PropTypes.bool,
    price: PropTypes.bool,
    reviews: PropTypes.bool,
  }),
  handleGetProducts: PropTypes.func,
  infiniteLoad: PropTypes.bool,
  meta: PropTypes.shape(),
  products: PropTypes.arrayOf(PropTypes.shape()),
  requestHash: PropTypes.string,
  resultIsFetching: PropTypes.bool,
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
  meta: null,
  resultIsFetching: undefined,
};

export default ProductGrid;
