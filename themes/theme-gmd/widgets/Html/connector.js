import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';

/**
 * Connects the dispatch function to a calleble function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: params => dispatch(historyPush(params)),
});

export default connect(null, mapDispatchToProps, null, { pure: () => true });
