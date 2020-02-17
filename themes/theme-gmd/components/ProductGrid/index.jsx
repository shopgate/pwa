import React from 'react';
import PropTypes from 'prop-types';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
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
}) => {
  // TODO: Integrate the setting into underlying components and remove the eslint-disable rule!
  // eslint-disable-next-line no-unused-vars
  const { columns = 2 } = useWidgetSettings(WIDGET_ID) || {};

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
    <ViewContext.Consumer>
      {({ getContentRef }) => (
        <InfiniteContainer
          containerRef={getContentRef()}
          wrapper={Layout}
          iterator={Iterator}
          loader={handleGetProducts}
          items={products}
          loadingIndicator={<LoadingIndicator />}
          totalItems={totalProductCount}
          initialLimit={ITEMS_PER_LOAD}
          limit={ITEMS_PER_LOAD}
          requestHash={requestHash}
        />
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
  totalProductCount: PropTypes.number,
};

ProductGrid.defaultProps = {
  flags: null,
  handleGetProducts: () => { },
  infiniteLoad: true,
  products: null,
  requestHash: null,
  totalProductCount: null,
};

export default ProductGrid;
