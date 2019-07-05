import React from 'react';
import PropTypes from 'prop-types';
import { MediaSlider as ProductMediaSlider, FeaturedMedia } from '@shopgate/engage/product';
import connect from './connector';

/**
 * The product media slider component.
 * @returns {JSX}
 */
const MediaSlider = ({ product, productId, hasMedia }) => {
  if (!hasMedia) {
    return (
      <FeaturedMedia {...product && product.featuredMedia} />
    );
  }

  return (
    <ProductMediaSlider productId={productId} />
  );
};

MediaSlider.propTypes = {
  hasMedia: PropTypes.bool,
  product: PropTypes.shape(),
  productId: PropTypes.string,
};

MediaSlider.defaultProps = {
  hasMedia: false,
  product: null,
  productId: null,
};

export default connect(MediaSlider);
