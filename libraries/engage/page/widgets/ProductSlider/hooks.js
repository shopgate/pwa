import { useMemo } from 'react';
import { camelCase } from 'lodash';
import { useWidget } from '@shopgate/engage/page/hooks';
import { getProductSearchParamsFromProductsInputConfig } from '@shopgate/engage/page/helpers';

/**
 * @typedef {import('@shopgate/engage/page/helpers')
 * .ProductsWidgetInputConfig} ProductsWidgetInputConfig
 */

/**
 * @typedef {Object} ProductSliderWidgetConfig
 * @property {ProductsWidgetInputConfig} products The products configuration for the widget.
 * @property {number} productCount The number of products to display in the widget.
 * @property {"relevance" | "priceDesc" | "priceAsc"} sort Sort order for the products.
 * @property {boolean} [showName] Whether to display product names.
 * @property {boolean} [showPrice] Whether to display product prices.
 * @property {boolean} [showRating] Whether to display product ratings.
 * @property {boolean} [slideAutomatic] Whether the slider should automatically slide.
 * @property {boolean} [endlessSlider] Whether the slider should loop endlessly.
 * @property {number} [sliderSpeed] The speed (in ms) for the slider autoplay.
 * @property {boolean} [isPreview] Whether the widget is in preview mode.
 * @property {boolean} [showHeadline] Whether to show the headline.
 * @property {string} [headline] The headline to be displayed.
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
    showHeadline = false,
    headline = '',
  } = config;

  const productSearchParams = useMemo(
    () => getProductSearchParamsFromProductsInputConfig(products),
    [products]
  );
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
    ...productSearchParams,
    sort: camelCase(sort),
    productCount,
    swiperProps,
    productItemProps,
    isPreview,
    showHeadline,
    headline,
  };
};
