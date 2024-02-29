import { connect } from 'react-redux';
import { getPushOptInModal } from '../../selectors';
import { grantPushPermissions } from '../../../core';
import { optInPostponed } from '../../action-creators';
import { hidePushOptInModal } from '../../actions';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  showPushOptInModal: getPushOptInModal(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  enablePushOptInModal: () => dispatch(grantPushPermissions({ useSettingsModal: true })),
  denyPushOptInModal: () => dispatch(optInPostponed()),
  hidePushOptInModal: () => dispatch(hidePushOptInModal()),
});

export default connect(mapStateToProps, mapDispatchToProps);
