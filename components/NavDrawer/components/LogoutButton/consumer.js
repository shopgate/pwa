import { consume } from 'redux-props';
import logout from '@shopgate/pwa-common/actions/user/logout';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';

/**
 * @returns {Object}
 */
const mapProps = ({ dispatch, state }) => ({
  loggedIn: isUserLoggedIn(state),
  logout: () => dispatch(logout()),
});

export default consume({
  mapProps,
});
