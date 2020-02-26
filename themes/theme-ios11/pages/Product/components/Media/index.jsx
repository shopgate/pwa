import React from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import { PORTAL_PRODUCT_MEDIA_SECTION } from '@shopgate/engage/components/constants';
import ProductImageSlider from './components/ProductImageSlider';
import ProductMediaSlider from './components/ProductMediaSlider';
import { ProductContext } from '../../context';

/**
 * The product media component.
 * @returns {JSX}
 */
const Media = ({ 'aria-hidden': ariaHidden, className }) => (
  <ProductContext.Consumer>
    {({ productId, variantId, characteristics }) => (
      <SurroundPortals
        portalName={PORTAL_PRODUCT_MEDIA_SECTION}
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
