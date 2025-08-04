import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { useThemeComponents } from '@shopgate/engage/core/hooks';
import { Swiper } from '@shopgate/engage/components';
import {
  ProductListTypeProvider,
  ProductListEntryProvider,
} from '@shopgate/engage/product/providers';
import { container, items } from './style';

export const WIDGET_ID = '@shopgate/engage/product/ProductSlider';

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function ProductSlider(props) {
  const {
    autoplay,
    className,
    delay,
    productIds,
    snap,
    scope,
    meta,
    productItemProps,
    item,
    ...swiperProps
  } = props;
  const widgetSettings = useWidgetSettings(WIDGET_ID) || {};
  const { slidesPerView = 2.3 } = props.slidesPerView ? props : widgetSettings;
  // ProductSlider items are rendered with the ProductCard component provided by the theme.
  const { ProductCard } = useThemeComponents();
  const Item = item || ProductCard;
  const shouldLoop = swiperProps.loop && productIds.length > slidesPerView + 1;

  return (
    <ProductListTypeProvider type="productSlider" subType={scope} meta={meta}>
      <Swiper
        {...autoplay && {
          autoplay: {
            delay,
          },
        }}
        className={`${className} engage__product__product-slider`}
        controls={false}
        indicators={false}
        freeMode={!snap}
        {...swiperProps}
        slidesPerView={slidesPerView}
        loop={shouldLoop}
      >
        {productIds.map(id => (
          <Swiper.Item key={id} className={container}>
            <ProductListEntryProvider productId={id}>
              <Item productId={id} style={items} {...productItemProps} />
            </ProductListEntryProvider>
          </Swiper.Item>
        ))}
      </Swiper>
    </ProductListTypeProvider>
  );
}

ProductSlider.WIDGET_ID = WIDGET_ID;

ProductSlider.propTypes = {
  productIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  delay: PropTypes.number,
  /**
   * Optional scope of the component. Will be used as subType property of the ProductListTypeContext
   * and is intended as a description in which "context" the component is used.
   * @default null
   */
  item: PropTypes.func,
  meta: PropTypes.shape(),
  productItemProps: PropTypes.shape(),
  scope: PropTypes.string,
  slidesPerView: PropTypes.number,
  snap: PropTypes.bool,
};

ProductSlider.defaultProps = {
  autoplay: false,
  className: null,
  delay: 10,
  item: null,
  meta: null,
  productItemProps: null,
  scope: null,
  slidesPerView: null,
  snap: false,
};

export default ProductSlider;
