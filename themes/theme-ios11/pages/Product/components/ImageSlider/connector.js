import { connect } from 'react-redux';
import {
  getProductImagesResolutions,
  getCurrentBaseProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import openGallery from '../../actions/openGallery';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  resolutions: getProductImagesResolutions(state),
  product: getCurrentBaseProduct(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  onOpen: (productId, currentSlide) => dispatch(openGallery(productId, currentSlide)),
});

export default connect(mapStateToProps, mapDispatchToProps);
