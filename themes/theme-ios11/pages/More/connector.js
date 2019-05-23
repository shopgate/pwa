import { connect } from 'react-redux';
import { isUserLoggedIn, getUserData } from '@shopgate/engage/user';
import { logout } from '@shopgate/engage/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  user: isUserLoggedIn(state) ? getUserData(state) : null,
  isLoggedIn: isUserLoggedIn(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps);
