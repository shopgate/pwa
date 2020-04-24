import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { INDEX_PATH } from '@shopgate/engage/core';

/**
 * @param {Function} dispatch The store dispatch method.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: () => dispatch(historyPush({ pathname: INDEX_PATH })),
});

export default connect(null, mapDispatchToProps);
