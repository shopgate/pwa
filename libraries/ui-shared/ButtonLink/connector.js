import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: location => dispatch(historyPush({ pathname: location })),
});

export default connect(null, mapDispatchToProps);
