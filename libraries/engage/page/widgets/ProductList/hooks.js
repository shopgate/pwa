import { useMemo } from 'react';
import { camelCase } from 'lodash';
import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} ProductListWidgetProducts
 * @property {"searchTerm" | "brand" | "category" | "manualItemNumbers" | "productSelector"
 * | "itemNumbers"} productSelectorType Source type for the product list.
 * @property {string} productsSearchTerm A search term to filter products by
 * @property {string} productsBrand A brand to filter products by
 * @property {string} productsCategory A category to filter products by
 * @property {string} productsItemNumbers A comma-separated list of item numbers to filter products
 * by
 * @property {string[]} productsManualItemNumbers Array of product item numbers (manual input)
 * @property {string[]} productsSelectorItemNumbers Array of product item numbers (product selector)
 */

/**
 * @typedef {Object} ProductListWidgetConfig
 * @property {ProductListWidgetProducts} products The products configuration for the widget.
 * @property {number} productCount The number of products to display in the widget
 * @property {"relevance" | "PriceDesc" | "PriceAsc"} sort Sort order for the products
 * @property {boolean} loadMoreButton Whether to display a "Load more" button
 * @property {boolean} showName Whether to display product names
 * @property {boolean} showPrice Whether to display product prices
 * @property {boolean} showRating Whether to display product ratings
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
  } = config;

  const {
    productSelectorType,
    productsBrand,
    productsCategory,
    productsItemNumbers,
    productsManualItemNumbers,
    productsSelectorItemNumbers,
    productsSearchTerm,
  } = products;

  const value = useMemo(() => {
    switch (productSelectorType) {
      case 'brand':
        return productsBrand;
      case 'category':
        return productsCategory;
      // Kept for backward compatibility - was replaces by 'manualItemNumbers' and 'productSelector'
      case 'itemNumbers':
        return productsItemNumbers.split(',').map(item => item.trim());
      case 'manualItemNumbers':
        return productsManualItemNumbers;
      case 'productSelector':
        return productsSelectorItemNumbers;
      case 'searchTerm':
      default:
        return productsSearchTerm;
    }
  }, [
    productSelectorType,
    productsBrand,
    productsCategory,
    productsSearchTerm,
    productsItemNumbers,
    productsManualItemNumbers,
    productsSelectorItemNumbers,
  ]);

  /** @type {"brand" | "category" | "productIds" | "searchTerm"} */
  const productsSearchType = useMemo(() => {
    // Map different input types that indicate arrays with item numbers to the same type
    if (['itemNumbers', 'manualItemNumbers', 'productSelector'].includes(productSelectorType)) {
      return 'productIds';
    }

    return productSelectorType;
  }, [productSelectorType]);

  const flags = useMemo(() => ({
    name: showName,
    price: showPrice,
    reviews: showRating,
  }), [showName, showPrice, showRating]);

  return {
    productsSearchType,
    productsSearchValue: value,
    sort: camelCase(sort),
    productCount,
    showLoadMore: loadMoreButton,
    flags,
  };
};
