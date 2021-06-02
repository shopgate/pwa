import { connect } from 'react-redux';
import {
  getProductImages,
  getProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  images: getProductImages(state, props),
  product: getProduct(state, props),
});

export default connect(mapStateToProps);
