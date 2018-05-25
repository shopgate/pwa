import { connect } from 'react-redux';
import { navigate } from '@shopgate/pwa-common/action-creators/router';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: link => dispatch(navigate(link)),
});

export default connect(null, mapDispatchToProps);
