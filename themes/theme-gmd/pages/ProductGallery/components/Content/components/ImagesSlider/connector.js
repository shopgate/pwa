import { connect } from 'react-redux';
import {
  getProductImages,
  getCurrentBaseProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { productImageFormats } from '@shopgate/pwa-common-commerce/product/collections';
import { GALLERY_SLIDER_IMAGE_COLLECTION_KEY } from '../../../../constants';
/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  images: getProductImages(state, {
    ...props,
    formats: productImageFormats.get(GALLERY_SLIDER_IMAGE_COLLECTION_KEY),
  }) || [],
  product: getCurrentBaseProduct(state, props),
});

/**
 * @param {*} next The next props.
 * @param {*} prev the previous props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.images && next.images) {
    return false;
  }

  if (!prev.product && next.product) {
    return false;
  }

  return true;
};

export default connect(
  mapStateToProps,
  null,
  null,
  { areStatePropsEqual }
);
