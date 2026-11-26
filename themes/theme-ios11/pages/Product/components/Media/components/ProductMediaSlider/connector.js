import { connect } from 'react-redux';
import {
  makeGetProductByCharacteristics,
  makeGetProductFeaturedMedia,
  makeGetCharacteristicsFeaturedMedia,
  makeGetProductMedia,
  MEDIA_TYPE_IMAGE,
  MEDIA_TYPE_VIDEO,
} from '@shopgate/engage/product';

const MEDIA_TYPES = [MEDIA_TYPE_VIDEO, MEDIA_TYPE_IMAGE];

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getProductByCharacteristics = makeGetProductByCharacteristics();
  const getProductFeaturedMedia = makeGetProductFeaturedMedia();
  const getCharacteristicsFeaturedMedia = makeGetCharacteristicsFeaturedMedia();
  const getProductMedia = makeGetProductMedia();

  return (state, props) => {
    const product = getProductByCharacteristics(state, props) || {};
    const productId = product.id || props.productId;

    return {
      featuredMediaBaseProduct: getProductFeaturedMedia(state, props),
      featuredMediaCharacteristics: getCharacteristicsFeaturedMedia(state, {
        ...props,
        type: MEDIA_TYPE_IMAGE,
      }),
      productId,
      media: getProductMedia(state, {
        productId,
        types: MEDIA_TYPES,
      }),
    };
  };
};

export default connect(makeMapStateToProps);
