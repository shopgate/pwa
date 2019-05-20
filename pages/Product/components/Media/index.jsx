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
const Media = ({ hasMedia }) => (
  <ProductContext.Consumer>
    {({ productId, variantId }) => (
      <Fragment>
        {/* MediaSlider feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects */}
        {
          hasMedia
          ? <MediaSlider productId={variantId || productId} />
          : <ImageSlider productId={productId} variantId={variantId} />
        }
      </Fragment>
    )}
  </ProductContext.Consumer>
);

Media.propTypes = {
  hasMedia: PropTypes.bool,
};

Media.defaultProps = {
  hasMedia: false,
};

export default connect(Media);
