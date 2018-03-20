import { connect } from 'react-redux';
import { getProductById } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the current application state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The populated component props.
 */
const mapStateToProps = (state, props) => ({
  product: getProductById(state, props.productId).productData || null,
});

export default connect(mapStateToProps);
