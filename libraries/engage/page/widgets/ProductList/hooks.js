import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} ProductListWidgetProducts
 * @property {"searchTerm" | "brand" | "category" | "itemNumbers"} productSelectorType Source type
 * for the product list.
 * @property {string} productsSearchTerm A search term to filter products by
 * @property {string} productsBrand A brand to filter products by
 * @property {string} productsCategory A category to filter products by
 * @property {string} productsItemNumbers A comma-separated list of item numbers to filter products
 * by
 */

/**
 * @typedef {Object} ProductListWidgetConfig
 * @property {ProductListWidgetProducts} products The products configuration for the widget.
 * @property {number} productCount The number of products to display in the widget
 * @property {"relevance" | "PriceDesc" | "PriceDesc"} sort Sort order for the products
 * @property {boolean} loadMoreButton Whether to display a "Load more" button
 * @property {boolean} showName Whether to display product names
 * @property {boolean} showPrice Whether to display product prices
 * @property {boolean} showRating Whether to display product ratings
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 * .useWidget<ProductListWidgetConfig> >} HookReturnType
 */

/**
 * Hook to access the Product List widget configuration.
 * @returns {HookReturnType}
 */
export const useProductListWidget = () => useWidget();
