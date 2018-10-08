import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the current application state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The populated component props.
 */
const mapStateToProps = (state, props) => ({
  product: getProduct(state, props),
});

export default connect(mapStateToProps);
