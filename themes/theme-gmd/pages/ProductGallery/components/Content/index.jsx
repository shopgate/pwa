import React from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { ProductListTypeProvider, ProductListEntryProvider } from '@shopgate/engage/product';
import MediaSlider from './components/MediaSlider';
import ImageSlider from './components/ImagesSlider';

/**
 * The product media component.
 * @param {string} productId productId
 * @param {number} initialSlide initialSlide
 * @returns {JSX}
 */
const Content = ({ productId, initialSlide }) => (
  <ProductListTypeProvider type="productGallery">
    <ProductListEntryProvider productId={productId}>
      {isBeta()
        ? <MediaSlider productId={productId} initialSlide={initialSlide} />
        : <ImageSlider productId={productId} initialSlide={initialSlide} />
    }
    </ProductListEntryProvider>
  </ProductListTypeProvider>
);

Content.propTypes = {
  initialSlide: PropTypes.number.isRequired,
  productId: PropTypes.string.isRequired,
};

export default Content;
