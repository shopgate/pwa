import { connect } from 'react-redux';
import { historyPop } from '@shopgate/engage/core';

/**
 * Maps action dispatchers to the component props.
 * @param {Function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: () => dispatch(historyPop()),
});

export default connect(null, mapDispatchToProps);
