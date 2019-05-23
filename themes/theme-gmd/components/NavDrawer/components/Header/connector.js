import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';
import {
  isUserLoggedIn,
  getUserEmail,
  getUserDisplayName,
  LOGIN_PATH,
} from '@shopgate/engage/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  isLoggedIn: isUserLoggedIn(state),
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
