import React from 'react';
import PropTypes from 'prop-types';
import { MediaSlider, FeaturedMedia } from '@shopgate/engage/product';
import connect from './connector';

/**
 * The product media slider component.
 * @returns {JSX}
 */
const ProductMediaSlider = ({ baseProduct, productId, hasMedia }) => {
  if (!hasMedia) {
    return (
      <FeaturedMedia {...baseProduct && baseProduct.featuredMedia} />
    );
  }

  return (
    <MediaSlider productId={productId} />
  );
};

ProductMediaSlider.propTypes = {
  baseProduct: PropTypes.shape(),
  hasMedia: PropTypes.bool,
  productId: PropTypes.string,
};

ProductMediaSlider.defaultProps = {
  baseProduct: null,
  hasMedia: false,
  productId: null,
};

export default connect(ProductMediaSlider);
