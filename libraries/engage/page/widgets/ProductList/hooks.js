import { useMemo } from 'react';
import { camelCase } from 'lodash';
import { useWidget } from '@shopgate/engage/page/hooks';
import { getProductSearchParamsFromProductsInputConfig } from '@shopgate/engage/page/helpers';

/**
 * @typedef {import('@shopgate/engage/page/helpers')
 * .ProductsWidgetInputConfig} ProductsWidgetInputConfig
 */

/**
 * @typedef {Object} ProductListWidgetConfig
 * @property {ProductsWidgetInputConfig} products The products configuration for the widget.
 * @property {number} productCount The number of products to display in the widget
 * @property {"relevance" | "PriceDesc" | "PriceAsc"} sort Sort order for the products
 * @property {boolean} loadMoreButton Whether to display a "Load more" button
 * @property {boolean} showName Whether to display product names
 * @property {boolean} showPrice Whether to display product prices
 * @property {boolean} showRating Whether to display product ratings
 * @property {boolean} [showHeadline] Whether to show the headline.
 * @property {Object} [headline] The headline to be displayed.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 * .useWidget<ProductListWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Product List widget configuration.
 */
export const useProductListWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();

  const {
    products,
    productCount,
    sort,
    loadMoreButton = false,
    showName = false,
    showPrice = false,
    showRating = false,
    showHeadline,
    headline,
  } = config;

  const productSearchParams = useMemo(
    () => getProductSearchParamsFromProductsInputConfig(products),
    [products]
  );

  const flags = useMemo(() => ({
    name: showName,
    price: showPrice,
    reviews: showRating,
  }), [showName, showPrice, showRating]);

  return {
    ...productSearchParams,
    sort: camelCase(sort),
    productCount,
    showLoadMore: loadMoreButton,
    flags,
    showHeadline,
    headline,
  };
};
