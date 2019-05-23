import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/engage/user';
import { getCartItems, getCartMessages, getCurrency } from '@shopgate/engage/cart';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isUserLoggedIn: isUserLoggedIn(state),
  cartItems: getCartItems(state),
  messages: getCartMessages(state),
  currency: getCurrency(state),
});

export default connect(mapStateToProps);
