import { connect } from 'react-redux';
import { historyPop } from '@shopgate/pwa-common/actions/router';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} dispatch The dispatch method from the store.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  close: () => dispatch(historyPop()),
});

export default connect(null, mapDispatchToProps);
