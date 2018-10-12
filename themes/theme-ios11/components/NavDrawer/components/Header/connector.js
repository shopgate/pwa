import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  getUserEmail,
  getUserDisplayName,
} from '@shopgate/pwa-common/selectors/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  email: getUserEmail(state),
  name: getUserDisplayName(state),
});

/**
 * Maps the contents of the state to the component props.
 * @param {Function} dispatch The dispatch method from the store.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  openLogin: () => dispatch(historyPush({
    pathname: LOGIN_PATH,
  })),
});

export default connect(mapStateToProps, mapDispatchToProps);
