import { connect } from 'react-redux';
import { historyPop } from '@shopgate/pwa-common/actions/router';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  close: () => dispatch(historyPop()),
});

export default connect(mapStateToProps);
