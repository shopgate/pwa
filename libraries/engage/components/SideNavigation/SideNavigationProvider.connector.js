import { connect } from 'react-redux';
import {
  getCurrentRoute,
  getCurrentPathname,
  getCurrentParams,
} from '@shopgate/pwa-common/selectors/router';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import logout from '@shopgate/pwa-common/actions/user/logout';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  currentParams: getCurrentParams(state),
  currentPathname: getCurrentPathname(state),
  currentRoute: getCurrentRoute(state),
  isLoggedIn: isUserLoggedIn(state),
});

/**
 * Maps the contents of the state to the component props.
 * @param {Function} dispatch The dispatch method from the store.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
