import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { Swiper } from '@shopgate/engage/components';
import { Theme } from '@shopgate/pwa-common/context';
import { ProductListTypeProvider, ProductListEntryProvider } from '@shopgate/engage/product';
import { container, items } from './style';

export const WIDGET_ID = '@shopgate/engage/product/ProductSlider';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
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
  } = props;

  const widgetSetting = useWidgetSettings(WIDGET_ID) || {};
  const { slidesPerView = 2.3 } = props.slidesPerView ? props : widgetSetting;

  return (
    <Theme>
      {({ ProductCard }) => {
        const Item = props.item || ProductCard;
        return (
          <ProductListTypeProvider type="productSlider" subType={scope} meta={meta}>
            <Swiper
              autoPlay={autoplay}
              className={className}
              controls={false}
              indicators={false}
              interval={delay}
              loop={false}
              freeMode={!snap}
              slidesPerView={slidesPerView}
            >
              {productIds.map(id => (
                <Swiper.Item key={id} className={container}>
                  <ProductListEntryProvider productId={id}>
                    <Item productId={id} style={items} />
                  </ProductListEntryProvider>
                </Swiper.Item>
              ))}
            </Swiper>
          </ProductListTypeProvider>
        );
      }}
    </Theme>
  );
}

ProductSlider.propTypes = {
  productIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  delay: PropTypes.number,
  item: PropTypes.func,
  /**
   * Optional scope of the component. Will be used as subType property of the ProductListTypeContext
   * and is intended as a description in which "context" the component is used.
   * @default null
   */
  meta: PropTypes.shape(),
  scope: PropTypes.string,
  slidesPerView: PropTypes.number,
  snap: PropTypes.bool,
};

ProductSlider.defaultProps = {
  autoplay: false,
  className: null,
  delay: 10,
  item: null,
  slidesPerView: null,
  snap: false,
  scope: null,
  meta: null,
};

export default ProductSlider;
