import { connect } from 'react-redux';
import logout from '@shopgate/pwa-common/actions/user/logout';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  loggedIn: isUserLoggedIn(state),
});

/**
 * Maps the contents of the state to the component props.
 * @param {Function} dispatch The dispatch method from the store.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps);
