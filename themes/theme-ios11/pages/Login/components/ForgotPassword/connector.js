import { connect } from 'react-redux';
import { showModal } from '@shopgate/engage/core';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  showForgotPasswordPopup: () => dispatch(showModal({
    confirm: 'modal.ok',
    dismiss: null,
    title: null,
    message: 'login.forgot_password_popup',
  })),
});

export default connect(null, mapDispatchToProps);
