import { connect } from 'react-redux';
import { getCartProductCount } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  cartProductCount: getCartProductCount(state),
});

export default connect(mapStateToProps);
