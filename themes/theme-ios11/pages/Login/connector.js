import { connect } from 'react-redux';
import { login } from '@shopgate/engage/user';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  login: (credentials, redirect) => dispatch(login(credentials, redirect)),
});

export default connect(null, mapDispatchToProps);
