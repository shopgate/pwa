import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { isBeta } from '@shopgate/engage/core';
import { SurroundPortals } from '@shopgate/engage/components';
import { PORTAL_PRODUCT_MEDIA_SECTION } from '@shopgate/engage/components/constants';
import { ProductDiscountBadge } from '@shopgate/engage/product';
import ProductImageSlider from './components/ProductImageSlider';
import ProductMediaSlider from './components/ProductMediaSlider';
import { ProductContext } from '../../context';

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
      <SurroundPortals
        portalName={PORTAL_PRODUCT_MEDIA_SECTION}
        portalProps={{
          productId,
          variantId,
        }}
      >
        <div className={styles.root}>
          <ProductDiscountBadge productId={productId} />
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
        </div>
      </SurroundPortals>
    )}
  </ProductContext.Consumer>
);

Media.propTypes = {
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
};

Media.defaultProps = {
  'aria-hidden': false,
  className: null,
};

export default Media;
