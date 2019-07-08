import React from 'react';
import PropTypes from 'prop-types';
import { MediaSlider as ProductMediaSlider, FeaturedMedia } from '@shopgate/engage/product';
import connect from './connector';

/**
 * The product media slider component.
 * @returns {JSX}
 */
const MediaSlider = ({ baseProduct, productId, hasMedia }) => {
  if (!hasMedia) {
    return (
      <FeaturedMedia {...baseProduct && baseProduct.featuredMedia} />
    );
  }

  return (
    <ProductMediaSlider productId={productId} />
  );
};

MediaSlider.propTypes = {
  baseProduct: PropTypes.shape(),
  hasMedia: PropTypes.bool,
  productId: PropTypes.string,
};

MediaSlider.defaultProps = {
  baseProduct: null,
  hasMedia: false,
  productId: null,
};

export default connect(MediaSlider);
