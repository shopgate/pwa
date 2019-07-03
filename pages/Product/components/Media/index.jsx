import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { MediaSlider } from '@shopgate/engage/product';
import { ProductContext } from '../../context';
import ImageSlider from './components/ImageSlider';

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
            ? <MediaSlider productId={variantId || productId} aria-hidden={ariaHidden} />
            : <ImageSlider productId={productId} variantId={variantId} aria-hidden={ariaHidden} />
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
