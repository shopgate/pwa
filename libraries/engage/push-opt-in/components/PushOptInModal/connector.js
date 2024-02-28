import { connect } from 'react-redux';
import { getPushOptInModalState } from '../../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  showPushOptInModal: getPushOptInModalState(state),
});

export default connect(mapStateToProps);
