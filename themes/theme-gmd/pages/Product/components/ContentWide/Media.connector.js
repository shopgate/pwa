import { connect } from 'react-redux';
import {
  getProduct,
  getProductImages,
} from '@shopgate/engage/product';

/**
 * Creates the mapStateToProps connector function.
 * @param {Object} state The state.
 * @param {Object} props The props.
 * @returns {Object}
 */
const mapStateToProps = (state, props) => {
  const product = getProduct(state, props);
  const featured = product?.featuredImageBaseUrl || product?.featuredImageUrl;

  return {
    featuredImage: featured,
    images: getProductImages(state, {
      ...props,
      productId: props.variantId || props.productId,
    }) || [],
  };
};

export default connect(mapStateToProps);

