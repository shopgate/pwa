import React, { useMemo } from 'react';
import { ProductSlider } from '@shopgate/engage/product/components';
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
  } = useWidgetProducts({
    type: productsSearchType,
    value: productsSearchValue,
    limit: productCount,
    sort,
  });
  const productIds = useMemo(() => results?.map(result => result.id), [results]);

  if (!productIds || !productIds.length) {
    return null;
  }

  return (
    <>
      {(showHeadline && headline && productIds.length) ? (
        <WidgetHeadline headline={headline} />
      ) : null}
      <ProductSlider
        productIds={productIds}
        scope="widgets"
        productItemProps={productItemProps}
      // Improves interaction with the slider in the CMS preview iframe
        {...isPreview ? { touchStartPreventDefault: true } : {}}
        {...swiperProps}
      />
    </>
  );
};

export default ProductSliderWidget;
