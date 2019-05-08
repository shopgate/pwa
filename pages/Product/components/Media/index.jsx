import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { ProductContext } from '../../context';
import connect from './connector';

const ImageSlider = lazy(() => import('./components/ImageSlider'));
const MediaSlider = lazy(() => import('./components/MediaSlider'));

/**
 * The product media component.
 * @param {boolean} hasMedia hasMedia
 * @returns {JSX}
 */
const Media = ({ hasMedia }) => (
  <ProductContext.Consumer>
    {({ productId, variantId }) => (
      <Suspense fallback={<div>Loading ... </div>}>
        {
          hasMedia
          ? <MediaSlider productId={productId} />
          : <ImageSlider productId={productId} variantId={variantId} />
        }
      </Suspense>
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
