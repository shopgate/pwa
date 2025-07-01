import React, { useMemo } from 'react';
import { camelCase } from 'lodash';
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
    config,
  } = useProductListWidget();

  const {
    products,
    productCount,
    sort,
    loadMoreButton = false,
    showName = false,
    showPrice = false,
    showRating = false,
  } = config;

  const {
    productSelectorType,
    productsBrand,
    productsCategory,
    productsItemNumbers,
    productsSearchTerm,
  } = products;

  const value = useMemo(() => {
    switch (productSelectorType) {
      case 'brand':
        return productsBrand;
      case 'category':
        return productsCategory;
      case 'itemNumbers':
        return productsItemNumbers;
      case 'searchTerm':
      default:
        return productsSearchTerm;
    }
  }, [
    productSelectorType,
    productsBrand,
    productsCategory,
    productsItemNumbers,
    productsSearchTerm,
  ]);

  const {
    fetchNext, hasNext, isFetching, results,
  } = useWidgetProducts({
    type: productSelectorType || 'searchTerm',
    value: value || '',
    limit: productCount,
    sort: camelCase(sort),
  });

  const flags = useMemo(() => ({
    name: showName,
    price: showPrice,
    reviews: showRating,
  }), [showName, showPrice, showRating]);

  return (
    <>
      <ProductGrid
        products={results}
        flags={flags}
        scope="widgets"
        infiniteLoad={false}
      />
      { hasNext && loadMoreButton && (
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
