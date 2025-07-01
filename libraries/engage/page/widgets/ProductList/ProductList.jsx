import React from 'react';
import { ActionButton, I18n } from '@shopgate/engage/components';
import { ProductGrid } from '@shopgate/engage/product/components';
import { useWidgetProducts } from '@shopgate/engage/page/hooks';
import { useProductListWidget } from './hooks';

/**
 * The ProductListWidget is used to display product lists.
 * @returns {JSX.Element}
 */
const ProductListWidget = () => {
  const {
    productsSearchType,
    productsSearchValue,
    sort,
    productCount,
    showLoadMore,
    flags,
  } = useProductListWidget();

  const {
    fetchNext, hasNext, isFetching, results,
  } = useWidgetProducts({
    type: productsSearchType,
    value: productsSearchValue,
    limit: productCount,
    sort,
  });

  return (
    <>
      <ProductGrid
        products={results}
        flags={flags}
        scope="widgets"
        infiniteLoad={false}
      />
      { hasNext && showLoadMore && (
      <ActionButton
        loading={isFetching}
        onClick={fetchNext}
      >
        <I18n.Text string="common.load_more" />
      </ActionButton>
      )}
    </>
  );
};

export default ProductListWidget;
