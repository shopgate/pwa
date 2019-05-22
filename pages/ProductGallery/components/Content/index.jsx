import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

const ImageSlider = lazy(() => import('./components/ImagesSlider'));
const MediaSlider = lazy(() => import('./components/MediaSlider'));

/**
 * The product media component.
 * @param {boolean} hasMedia hasMedia
 * @param {string} productId productId
 * @param {number} initialSlide initialSlide
 * @returns {JSX}
 */
const Content = ({ hasMedia, productId, initialSlide }) => (
  <Suspense fallback={<div />}>
    {
      hasMedia
      ? <MediaSlider productId={productId} initialSlide={initialSlide} />
      : <ImageSlider productId={productId} initialSlide={initialSlide} />
    }
  </Suspense>
);

Content.propTypes = {
  hasMedia: PropTypes.bool.isRequired,
  initialSlide: PropTypes.number.isRequired,
  productId: PropTypes.string.isRequired,
};

export default connect(Content);
