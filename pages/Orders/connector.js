import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: number => dispatch(goBackHistory(number)),
});

export default connect(null, mapDispatchToProps, null, { withRef: true });
