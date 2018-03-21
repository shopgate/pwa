import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import connect from '@shopgate/pwa-common/components/Router/helpers/connect/index';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: () => dispatch(goBackHistory(1)),
});

export default connect(null, mapDispatchToProps);
