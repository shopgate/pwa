import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { isBeta } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  PORTAL_PRODUCT_MEDIA_SECTION,
  PORTAL_PRODUCT_IMAGE_SLIDER,
} from '@shopgate/engage/components/constants';
import {
  ProductDiscountBadge,
} from '@shopgate/engage/product/components';
import {
  ProductListTypeProvider,
  ProductListEntryProvider,
} from '@shopgate/engage/product/providers';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { useProductGallerySettings } from '@shopgate/engage/product/hooks';
import { getProductActionButtons } from '@shopgate/engage/settings/selectors/appSettings';
import ProductImageSlider from './components/ProductImageSlider';
import ProductMediaSlider from './components/ProductMediaSlider';
import CTAButtons from '../Header/components/CTAButtons';

const SWIPER_FRACTION_MARGIN = 4;

const useStyles = makeStyles()((theme) => {
  const { margin, borderRadius } = theme.components.productMedia;
  const fractionOffset = theme.spacing(2) - SWIPER_FRACTION_MARGIN;
  const rounded = {
    borderRadius,
    overflow: 'hidden',
    isolation: 'isolate',
  };

  return {
    wrapper: {
      padding: margin,
      [theme.vars.components.iconButton.boxShadow]: theme.components.actionButton.boxShadow,
    },
    frame: {
      position: 'relative',
    },
    root: {
      position: 'relative',
      '--swiper-pagination-fraction-top-offset': `${fractionOffset}px`,
      '&[data-pagination="progressbar"]': {
        '--swiper-pagination-inset-left': borderRadius,
        '--swiper-pagination-inset-right': borderRadius,
      },
    },
    slider: {
      '&:not(.common__swiper), & > .swiper': rounded,
      '[data-pagination="bulletsBelow"] & > .swiper': {
        borderRadius: 0,
      },
      '[data-pagination="bulletsBelow"] & .swiper-slide': rounded,
      '[data-action-buttons-position="topRight"] & .swiper-pagination-fraction': {
        top: 'auto',
        bottom: fractionOffset,
      },
    },
  };
});

/**
 * The product media component.
 * @returns {JSX}
 */
const Media = ({ 'aria-hidden': ariaHidden, className }) => {
  const { classes, cx } = useStyles();
  const { pagination } = useProductGallerySettings();
  const { position: actionButtonsPosition } = useSelector(getProductActionButtons);
  const sliderClassName = cx(className, classes.slider);

  return (
    <ProductContext.Consumer>
      {({
        productId, variantId: selectedVariantId, displayVariantId: variantId, characteristics,
      }) => (
        <ProductListTypeProvider type="pdp" subType="mediaSection">
          <ProductListEntryProvider productId={variantId || productId}>
            <div className={classes.wrapper}>
              <div className={classes.frame}>
                <SurroundPortals
                  portalName={PORTAL_PRODUCT_MEDIA_SECTION}
                  portalProps={{
                    productId,
                    variantId: selectedVariantId,
                    displayVariantId: variantId,
                  }}
                >
                  <div
                    className={classes.root}
                    data-pagination={pagination}
                    data-action-buttons-position={actionButtonsPosition}
                  >
                    <ProductDiscountBadge productId={productId} />

                    <SurroundPortals
                      portalName={PORTAL_PRODUCT_IMAGE_SLIDER}
                      portalProps={{
                        productId,
                        variantId: selectedVariantId,
                        displayVariantId: variantId,
                      }}
                    >
                      {/* MediaSlider feature is currently in BETA testing.
                    It should only be used for approved BETA Client Projects */}
                      {isBeta() ? (
                        <ProductMediaSlider
                          productId={productId}
                          variantId={variantId}
                          characteristics={characteristics}
                          aria-hidden={ariaHidden}
                          className={sliderClassName}
                        />
                      ) : (
                        <ProductImageSlider
                          productId={productId}
                          variantId={variantId}
                          aria-hidden={ariaHidden}
                          className={sliderClassName}
                        />
                      )}
                    </SurroundPortals>
                  </div>
                </SurroundPortals>
                <CTAButtons
                  productId={selectedVariantId || productId}
                  displayedProductId={variantId || productId}
                />
              </div>
            </div>
          </ProductListEntryProvider>
        </ProductListTypeProvider>
      )}
    </ProductContext.Consumer>
  );
};

Media.propTypes = {
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
};

Media.defaultProps = {
  'aria-hidden': false,
  className: null,
};

export default Media;
