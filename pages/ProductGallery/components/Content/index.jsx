import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaSlider from './components/MediaSlider';
import ImageSlider from './components/ImagesSlider';
import connect from './connector';

/**
 * The product media component.
 * @param {boolean} hasMedia hasMedia
 * @param {string} productId productId
 * @param {number} initialSlide initialSlide
 * @returns {JSX}
 */
const Content = ({ hasMedia, productId, initialSlide }) => (
  <Fragment>
    {
      hasMedia
      ? <MediaSlider productId={productId} initialSlide={initialSlide} />
      : <ImageSlider productId={productId} initialSlide={initialSlide} />
    }
  </Fragment>
);

Content.propTypes = {
  hasMedia: PropTypes.bool.isRequired,
  initialSlide: PropTypes.number.isRequired,
  productId: PropTypes.string.isRequired,
};

export default connect(Content);
