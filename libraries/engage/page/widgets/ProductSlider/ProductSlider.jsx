import React, { useMemo } from 'react';
import { ProductSlider } from '@shopgate/engage/product/components';
import { useWidgetProducts } from '@shopgate/engage/page/hooks';
import { useProductSliderWidget } from './hooks';

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
    flags,
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

  return (
    <ProductSlider
      productIds={productIds}
      scope="widgets"
      {...flags}
    />
  );
};

export default ProductSliderWidget;
