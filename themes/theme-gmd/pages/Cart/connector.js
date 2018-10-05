import { connect } from 'react-redux';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';
import { getCartItems, getCartMessages } from '@shopgate/pwa-common-commerce/cart/selectors';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  cartItems: getCartItems(state),
  isLoading: isViewLoading(state, CART_PATH),
  messages: getCartMessages(state),
});

export default connect(mapStateToProps, null, null, { withRef: true });
