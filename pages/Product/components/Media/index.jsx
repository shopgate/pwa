import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { ProductContext } from '../../context';
import ProductImageSlider from './components/ProductImageSlider';
import ProductMediaSlider from './components/ProductMediaSlider';

/**
 * The product media component.
 * @returns {JSX}
 */
const Media = ({ 'aria-hidden': ariaHidden }) => (
  <ProductContext.Consumer>
    {({ productId, variantId }) => (
      <Fragment>
        {/* MediaSlider feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects */}
        {isBeta()
          ? <ProductMediaSlider
            productId={variantId || productId}
            aria-hidden={ariaHidden}
          />
          : <ProductImageSlider
            productId={productId}
            variantId={variantId}
            aria-hidden={ariaHidden}
          />
        }
      </Fragment>
    )}
  </ProductContext.Consumer>
);

Media.propTypes = {
  'aria-hidden': PropTypes.bool,
};

Media.defaultProps = {
  'aria-hidden': null,
};

export default Media;
