import { useMemo } from 'react';
import { camelCase } from 'lodash';
import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} ProductSliderWidgetProducts
 * @property {"searchTerm" | "brand" | "category" | "itemNumbers"} productSelectorType Source type
 * for the product list.
 * @property {string} productsSearchTerm A search term to filter products by
 * @property {string} productsBrand A brand to filter products by
 * @property {string} productsCategory A category to filter products by
 * @property {string} productsItemNumbers A comma-separated list of item numbers to filter products
 * by
 */

/**
 * @typedef {Object} ProductSliderWidgetConfig
 * @property {ProductSliderWidgetProducts} products The products configuration for the widget.
 * @property {number} productCount The number of products to display in the widget
 * @property {"relevance" | "PriceDesc" | "PriceDesc"} sort Sort order for the products
 * @property {boolean} loadMoreButton Whether to display a "Load more" button
 * @property {boolean} showName Whether to display product names
 * @property {boolean} showPrice Whether to display product prices
 * @property {boolean} showRating Whether to display product ratings
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 * .useWidget<ProductSliderWidgetConfig> >} UseWidgetReturnType
 */

/**
 * Hook to access the Product Slider widget configuration.
 * @returns {Object} the widget config
 */
export const useProductSliderWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();

  const {
    products,
    productCount,
    sort,
    showName = false,
    showPrice = false,
    showRating = false,
    slideAutomatic = true,
    endlessSlider = true,
    sliderSpeed = 7000,
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
        return productsItemNumbers.split(',').map(item => item.trim());
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

  const flags = useMemo(() => ({
    hideName: !showName,
    hidePrice: !showPrice,
    hideRating: !showRating,
    autoplay: slideAutomatic,
    delay: sliderSpeed,
    loop: endlessSlider,
  }), [showName, showPrice, showRating, slideAutomatic, sliderSpeed, endlessSlider]);

  return {
    productsSearchType: productSelectorType,
    productsSearchValue: value,
    sort: camelCase(sort),
    productCount,
    flags,
  };
};
