import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: pathname => dispatch(historyPush({ pathname })),
});

export default connect(null, mapDispatchToProps);
