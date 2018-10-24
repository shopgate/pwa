import { connect } from 'react-redux';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import login from '@shopgate/pwa-common/actions/user/login';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';
import { isUserLoginDisabled } from '@shopgate/pwa-common/selectors/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isLoading: isViewLoading(state, LOGIN_PATH),
  isDisabled: isUserLoginDisabled(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  login: (credentials, redirect) => dispatch(login(credentials, redirect)),
});

export default connect(mapStateToProps, mapDispatchToProps);
