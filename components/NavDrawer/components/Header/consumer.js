import { consume } from 'redux-props';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  getUserDisplayName,
  getUserEmail,
} from '@shopgate/pwa-common/selectors/user';

/**
 * @returns {Object}
 */
const mapProps = ({ dispatch, state }) => ({
  email: getUserEmail(state),
  name: getUserDisplayName(state),
  openLogin: () => dispatch(historyPush({
    pathname: LOGIN_PATH,
  })),
});

export default consume({
  mapProps,
});
