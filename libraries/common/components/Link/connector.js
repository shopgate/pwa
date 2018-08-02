import { connect } from 'react-redux';
import { historyPush, historyReplace } from '../../actions/router';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  historyPush: params => dispatch(historyPush(params)),
  historyReplace: params => dispatch(historyReplace(params)),
});

export default connect(null, mapDispatchToProps);
