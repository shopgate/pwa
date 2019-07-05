import { connect } from 'react-redux';
import { appError } from './../../action-creators/error';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  appError: error => dispatch(appError(error)),
});

export default connect(null, mapDispatchToProps);
