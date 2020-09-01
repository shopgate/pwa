import { connect } from 'react-redux';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import {
  getProductImages,
  getCurrentBaseProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  images: getProductImages(state, props),
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
      pathname: `${ITEM_PATH}/${bin2hex(props.variantId || props.productId)}/gallery/${currentSlide}`,
    })),
});

export default connect(mapStateToProps, mapDispatchToProps);
