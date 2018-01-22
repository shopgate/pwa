/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';

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
