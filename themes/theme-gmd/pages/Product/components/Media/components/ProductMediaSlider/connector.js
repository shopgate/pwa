import { connect } from 'react-redux';
import {
  makeGetProductByCharacteristics,
  makeGetProductFeaturedMedia,
  makeGetCharacteristicsFeaturedMedia,
  MEDIA_TYPE_IMAGE,
} from '@shopgate/engage/product';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getProductByCharacteristics = makeGetProductByCharacteristics();
  const getProductFeaturedMedia = makeGetProductFeaturedMedia();
  const getCharacteristicsFeaturedMedia = makeGetCharacteristicsFeaturedMedia();

  return (state, props) => {
    const product = getProductByCharacteristics(state, props) || {};

    return {
      featuredMediaBaseProduct: getProductFeaturedMedia(state, props),
      featuredMediaCharacteristics: getCharacteristicsFeaturedMedia(state, {
        ...props,
        type: MEDIA_TYPE_IMAGE,
      }),
      productId: product.id || props.productId,
    };
  };
};

export default connect(makeMapStateToProps);
