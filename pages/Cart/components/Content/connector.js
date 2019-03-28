import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { getCartItems, getCartMessages } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isUserLoggedIn: isUserLoggedIn(state),
  cartItems: getCartItems(state),
  messages: getCartMessages(state),
});

export default connect(mapStateToProps);
