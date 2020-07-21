// @flow
import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router/historyPush';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  openMap: url => dispatch(historyPush({ pathname: url })),
});

export default connect(null, mapDispatchToProps);
