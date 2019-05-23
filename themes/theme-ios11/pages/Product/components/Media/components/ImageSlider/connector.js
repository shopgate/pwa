import { connect } from 'react-redux';
import { bin2hex } from '@shopgate/engage/core';
import { ITEM_PATH } from '@shopgate/engage/product';
import { historyPush } from '@shopgate/engage/core';
import { productImageFormats } from '@shopgate/engage/product';
import {
  getProductImages,
  getCurrentBaseProduct,
} from '@shopgate/engage/product';
import { PRODUCT_SLIDER_IMAGE_COLLECTION_KEY } from '../../../../constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  images: getProductImages(state, {
    ...props,
    formats: productImageFormats.get(PRODUCT_SLIDER_IMAGE_COLLECTION_KEY),
  }),
  product: getCurrentBaseProduct(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch, props) => ({
  navigate: currentSlide =>
    dispatch(historyPush({
      pathname: `${ITEM_PATH}/${bin2hex(props.productId)}/gallery/${currentSlide}`,
    })),
});

/**
 * Check to see if the image slider properties have arrived.
 * @param {*} next The next props.
 * @param {*} prev The previous props.
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
  mapDispatchToProps,
  null,
  { areStatePropsEqual }
);
