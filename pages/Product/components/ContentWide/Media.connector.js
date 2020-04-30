import { connect } from 'react-redux';
import {
  makeGetCharacteristicsFeaturedImage,
  getBaseProduct,
  getProductImages,
} from '@shopgate/engage/product';
import { productImageFormats } from '@shopgate/pwa-common-commerce/product/collections';
import { PRODUCT_SLIDER_IMAGE_COLLECTION_KEY } from '../../constants';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getCharacteristicsFeaturedImage = makeGetCharacteristicsFeaturedImage();

  return (state, props) => {
    const childFeatured = getCharacteristicsFeaturedImage(state, props);
    const featured = getBaseProduct(state, props)?.featuredImageUrl;

    return {
      featuredImage: childFeatured || featured,
      images: getProductImages(state, {
        ...props,
        productId: props.variantId || props.productId,
        formats: productImageFormats.get(PRODUCT_SLIDER_IMAGE_COLLECTION_KEY),
      }) || [],
    };
  };
};

export default connect(makeMapStateToProps);

