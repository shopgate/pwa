import { connect } from 'react-redux';
import { goBackHistory } from 'Library/actions/history';
import {
  getCartItems,
  getCurrency,
  getCartMessages,
} from 'Library/selectors/cart';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  cartItems: getCartItems(state),
  currency: getCurrency(state),
  messages: getCartMessages(state),
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: () => dispatch(goBackHistory(1)),
});

/**
 * Connects a component to the global store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
const connector = Component =>
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Component)
;

export default connector;
