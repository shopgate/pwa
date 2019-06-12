import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { MediaSlider } from '@shopgate/engage/product';
import { ProductContext } from '../../context';
import ImageSlider from './components/ImageSlider';
import connect from './connector';

/**
 * The product media component.
 * @param {boolean} hasMedia hasMedia
 * @returns {JSX}
 */
const Media = ({ hasMedia, 'aria-hidden': ariaHidden }) => (
  <ProductContext.Consumer>
    {({ productId, variantId }) => (
      <Fragment>
        {/* MediaSlider feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects */}
        {
          hasMedia
            ? <MediaSlider productId={variantId || productId} aria-hidden={ariaHidden} />
            : <ImageSlider productId={productId} variantId={variantId} aria-hidden={ariaHidden} />
        }
      </Fragment>
      )}
  </ProductContext.Consumer>
);

Media.propTypes = {
  'aria-hidden': PropTypes.bool,
  hasMedia: PropTypes.bool,
};

Media.defaultProps = {
  'aria-hidden': null,
  hasMedia: false,
};

export default connect(Media);
