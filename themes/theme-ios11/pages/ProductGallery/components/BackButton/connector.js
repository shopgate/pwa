import { connect } from 'react-redux';
import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: (amount = 1) => dispatch(goBackHistory(amount)),
});

export default connect(null, mapDispatchToProps);
