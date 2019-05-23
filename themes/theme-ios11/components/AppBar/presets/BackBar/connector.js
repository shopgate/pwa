import { connect } from 'react-redux';
import { historyPop } from '@shopgate/engage/core';

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(historyPop()),
});

export default connect(null, mapDispatchToProps, null, { pure: () => null });
