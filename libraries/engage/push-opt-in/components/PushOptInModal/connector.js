import { connect } from 'react-redux';
import { getIsPushOptInModalVisible } from '../../selectors';
import { allowPushOptIn, denyPushOptIn } from '../../actions';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isPushOptInModalVisible: getIsPushOptInModalVisible(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  allowPushOptIn,
  denyPushOptIn,
};

export default connect(mapStateToProps, mapDispatchToProps);
