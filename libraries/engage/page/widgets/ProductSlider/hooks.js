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
 * @typedef {Object} ProductSliderWidgetConfig
 * @property {ProductSliderWidgetProducts} products The products configuration for the widget.
 * @property {number} productCount The number of products to display in the widget.
 * @property {"relevance" | "priceDesc" | "priceAsc"} sort Sort order for the products.
 * @property {boolean} [showName] Whether to display product names.
 * @property {boolean} [showPrice] Whether to display product prices.
 * @property {boolean} [showRating] Whether to display product ratings.
 * @property {boolean} [slideAutomatic] Whether the slider should automatically slide.
 * @property {boolean} [endlessSlider] Whether the slider should loop endlessly.
 * @property {number} [sliderSpeed] The speed (in ms) for the slider autoplay.
 * @property {boolean} [isPreview] Whether the widget is in preview mode.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 * .useWidget<ProductSliderWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Product Slider widget configuration.
 */
export const useProductSliderWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config, isPreview } = useWidget();

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

  const swiperProps = useMemo(() => ({
    autoplay: slideAutomatic,
    delay: sliderSpeed,
    loop: endlessSlider,
  }), [slideAutomatic, sliderSpeed, endlessSlider]);

  const productItemProps = useMemo(() => ({
    hideName: !showName,
    hidePrice: !showPrice,
    hideRating: !showRating,
  }), [showName, showPrice, showRating]);

  return {
    productsSearchType,
    productsSearchValue: value,
    sort: camelCase(sort),
    productCount,
    swiperProps,
    productItemProps,
    isPreview,
  };
};
