import { connect } from 'react-redux';
import {
  getProduct,
  getProductImages,
} from '@shopgate/engage/product';
import { productImageFormats } from '@shopgate/pwa-common-commerce/product/collections';
import { PRODUCT_SLIDER_IMAGE_COLLECTION_KEY } from '../../constants';

/**
 * Creates the mapStateToProps connector function.
 * @param {Object} state The state.
 * @param {Object} props The props.
 * @returns {Object}
 */
const mapStateToProps = (state, props) => {
  const product = getProduct(state, props);
  const featured = product?.featuredImageUrl;

  return {
    featuredImage: featured,
    images: getProductImages(state, {
      ...props,
      productId: props.variantId || props.productId,
      formats: productImageFormats.get(PRODUCT_SLIDER_IMAGE_COLLECTION_KEY),
    }) || [],
  };
};

export default connect(mapStateToProps);

