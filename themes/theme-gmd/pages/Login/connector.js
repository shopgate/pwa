import { connect } from 'react-redux';
import { login, isUserLoginDisabled } from '@shopgate/engage/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
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
