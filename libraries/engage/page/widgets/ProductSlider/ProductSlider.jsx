import React, { useMemo } from 'react';
import { ProductSlider } from '@shopgate/engage/product/components';
import { useWidgetProducts } from '@shopgate/engage/page/hooks';
import { useTheme } from '@shopgate/engage/styles';
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
    swiperProps,
    productItemProps,
  } = useProductSliderWidget();

  const {
    results,
  } = useWidgetProducts({
    type: productsSearchType,
    value: productsSearchValue,
    limit: productCount,
    sort,
  });
  const theme = useTheme();
  const productIds = useMemo(() => results?.map(result => result.id), [results]);

  return (
    <ProductSlider
      productIds={productIds}
      scope="widgets"
      productItemProps={productItemProps}
      slidesPerView={2.3}
      breakpoints={{
        [theme.breakpoints.values.sm]: {
          slidesPerView: 3.3,
        },
        [theme.breakpoints.values.md]: {
          slidesPerView: 4.3,
        },
        [theme.breakpoints.values.lg]: {
          slidesPerView: 5.3,
        },
      }}
      {...swiperProps}
    />
  );
};

export default ProductSliderWidget;
