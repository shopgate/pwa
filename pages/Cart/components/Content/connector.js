import { connect } from 'react-redux';
import {
  getCartItems, getCartMessages, getCurrency, getFlags,
} from '@shopgate/engage/cart';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';

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
  flags: getFlags(state),
});

export default connect(mapStateToProps);
