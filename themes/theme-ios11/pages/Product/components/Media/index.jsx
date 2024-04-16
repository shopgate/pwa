import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { isBeta } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  PORTAL_PRODUCT_MEDIA_SECTION,
  PORTAL_PRODUCT_IMAGE_SLIDER,
} from '@shopgate/engage/components/constants';
import {
  ProductContext,
  ProductListTypeProvider,
  ProductListEntryProvider,
} from '@shopgate/engage/product';
import ProductDiscountBadge from '@shopgate/engage/product/components/ProductDiscountBadge';
import ProductImageSlider from './components/ProductImageSlider';
import ProductMediaSlider from './components/ProductMediaSlider';

const styles = {
  root: css({
    position: 'relative',
  }),
};

/**
 * The product media component.
 * @returns {JSX}
 */
const Media = ({ 'aria-hidden': ariaHidden, className }) => (
  <ProductContext.Consumer>
    {({ productId, variantId, characteristics }) => (
      <ProductListTypeProvider type="pdp" subType="mediaSection">
        <ProductListEntryProvider productId={variantId || productId}>
          <SurroundPortals
            portalName={PORTAL_PRODUCT_MEDIA_SECTION}
            portalProps={{
              productId,
              variantId,
            }}
          >
            <div className={styles.root}>
              <ProductDiscountBadge productId={productId} />

              <SurroundPortals
                portalName={PORTAL_PRODUCT_IMAGE_SLIDER}
                portalProps={{
                  productId,
                  variantId,
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
                    className={className}
                  />
                ) : (
                  <ProductImageSlider
                    productId={productId}
                    variantId={variantId}
                    aria-hidden={ariaHidden}
                    className={className}
                  />
                )}
              </SurroundPortals>
            </div>
          </SurroundPortals>
        </ProductListEntryProvider>
      </ProductListTypeProvider>
    )}
  </ProductContext.Consumer>
);

Media.propTypes = {
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
};

Media.defaultProps = {
  'aria-hidden': null,
  className: null,
};

export default Media;
