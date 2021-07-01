import { connect } from 'react-redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import config from '../config';

/**
 * @param {Object} state The current application state
 * @return {{isShown: boolean}}
 */
const mapStateToProps = state => ({
  isShown: config.isActive && isUserLoggedIn(state),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {{deleteAccountRequest: (function(): *)}}
 */
const mapDispatchToProps = dispatch => ({
  deleteAccount: () => dispatch({
    type: 'DELETE_ACCOUNT_REQUESTED',
  }),
});

export default connect(mapStateToProps, mapDispatchToProps);
