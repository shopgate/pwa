import { connect } from 'react-redux';
import { INDEX_PATH, historyResetTo } from '@shopgate/engage/core';

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  handleClose: () => dispatch(historyResetTo(INDEX_PATH)),
});

export default connect(null, mapDispatchToProps);
