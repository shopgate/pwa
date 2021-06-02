import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import MediaSlider from './components/MediaSlider';
import ImageSlider from './components/ImagesSlider';

/**
 * The product media component.
 * @param {string} productId productId
 * @param {number} initialSlide initialSlide
 * @returns {JSX}
 */
const Content = ({ productId, initialSlide }) => (
  <Fragment>
    {isBeta()
      ? <MediaSlider productId={productId} initialSlide={initialSlide} />
      : <ImageSlider productId={productId} initialSlide={initialSlide} />
    }
  </Fragment>
);

Content.propTypes = {
  initialSlide: PropTypes.number.isRequired,
  productId: PropTypes.string.isRequired,
};

export default Content;
