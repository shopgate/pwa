import { connect } from 'react-redux';
import { historyReplace } from '@shopgate/engage/core';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  historyReplace,
};

export default connect(null, mapDispatchToProps);
