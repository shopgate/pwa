import React from 'react';
import PropTypes from 'prop-types';
import { MediaSlider, FeaturedMedia } from '@shopgate/engage/product';
import connect from './connector';

/**
 * The product media slider component.
 * @returns {JSX}
 */
const ProductMediaSlider = ({
  productId,
  featuredMediaBaseProduct,
  featuredMediaCharacteristics,
}) => (
  <MediaSlider
    productId={productId}
    renderPlaceholder={(featuredMedia) => {
      const props = featuredMediaCharacteristics || featuredMedia || featuredMediaBaseProduct;
      return (<FeaturedMedia {...props} />);
    }}
  />
);

ProductMediaSlider.propTypes = {
  featuredMediaBaseProduct: PropTypes.shape({
    type: PropTypes.string,
    code: PropTypes.string,
    altText: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
  featuredMediaCharacteristics: PropTypes.shape({
    type: PropTypes.string,
    code: PropTypes.string,
    altText: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
  productId: PropTypes.string,
  variantId: PropTypes.string,
};

ProductMediaSlider.defaultProps = {
  featuredMediaCharacteristics: null,
  featuredMediaBaseProduct: null,
  productId: null,
  variantId: null,
};

export default connect(ProductMediaSlider);
