import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router/historyPush';
import { historyPop } from '@shopgate/pwa-common/actions/router/historyPop';
import { historyReplace } from '@shopgate/pwa-common/actions/router/historyReplace';
import { historyReset } from '@shopgate/pwa-common/actions/router/historyReset';

/**
 * @param {Function} dispatch Dispatches redux actions.
 * @returns {Object}
 */
function mapDispatchToProps(dispatch) {
  return {
    push: params => dispatch(historyPush(params)),
    pop: () => dispatch(historyPop()),
    replace: params => dispatch(historyReplace(params)),
    reset: () => dispatch(historyReset()),
  };
}

export default connect(null, mapDispatchToProps, null, { pure: () => null });
