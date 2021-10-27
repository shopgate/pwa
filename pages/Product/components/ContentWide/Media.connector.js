import { connect } from 'react-redux';
import {
  getProductImages,
  getFeaturedImage,
} from '@shopgate/engage/product';

/**
 * Creates the mapStateToProps connector function.
 * @param {Object} state The state.
 * @param {Object} props The props.
 * @returns {Object}
 */
const mapStateToProps = (state, props) => {
  const featuredImage = getFeaturedImage(state, props);

  return {
    featuredImage,
    images: getProductImages(state, {
      ...props,
      productId: props.variantId || props.productId,
    }) || [],
  };
};

export default connect(mapStateToProps);

