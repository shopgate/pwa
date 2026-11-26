import React, { useMemo } from 'react';
import { ProductSlider } from '@shopgate/engage/product/components';
import ProductCardPlaceholder from '@shopgate/engage/product/components/ProductCard/ProductCardPlaceholder';
import { useSlidesPerView } from '@shopgate/engage/product/components/ProductSlider/hooks';
import { useWidgetProducts } from '@shopgate/engage/page/hooks';
import { useProductSliderWidget } from './hooks';
import WidgetHeadline from '../../components/WidgetHeadline';

/**
 * The ProductSliderWidget is used to display a product slider.
 * @returns {JSX.Element}
 */
const ProductSliderWidget = () => {
  const {
    productsSearchType,
    productsSearchValue,
    sort,
    productCount,
    swiperProps,
    productItemProps,
    isPreview,
    showHeadline,
    headline,
  } = useProductSliderWidget();

  const {
    results,
    isLoading,
  } = useWidgetProducts({
    type: productsSearchType,
    value: productsSearchValue,
    limit: productCount,
    sort,
  });
  const productIds = useMemo(() => results.map(result => result.id), [results]);
  const placeholderCount = Math.ceil(useSlidesPerView());
  const placeholderIds = useMemo(
    () => Array.from({ length: placeholderCount }, (_, index) => `placeholder-${index}`),
    [placeholderCount]
  );

  if (!isLoading && !productIds.length) {
    return null;
  }

  return (
    <>
      {(showHeadline && headline) ? (
        <WidgetHeadline headline={headline} />
      ) : null}
      <ProductSlider
        key={isLoading ? 'placeholders' : 'products'}
        productIds={isLoading ? placeholderIds : productIds}
        scope="widgets"
        productItemProps={productItemProps}
      // Improves interaction with the slider in the CMS preview iframe
        {...isPreview ? { touchStartPreventDefault: true } : {}}
        {...swiperProps}
        {...isLoading && {
          item: ProductCardPlaceholder,
          autoplay: false,
          loop: false,
        }}
      />
    </>
  );
};

export default ProductSliderWidget;
