import { connect } from 'react-redux';
import { INDEX_PATH } from '@shopgate/engage/core';
import { navigate } from './WideBar.actions';

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: () => dispatch(navigate(INDEX_PATH)),
});

export default connect(null, mapDispatchToProps);
