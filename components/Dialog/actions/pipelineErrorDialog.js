/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';

/**
 * Disables the navigator.
 * @return {Function} A redux thunk.
 */
const pipelineErrorDialog = ({ name, input, error }) => (dispatch) => {
  dispatch(showModal({
    // Show an 'OK' instead of a 'dismiss' button.
    dismiss: 'modal.ok',
    // Do not show the confirm button.
    confirm: null,
    // Give the template a clue about how to show this modal.
    type: MODAL_PIPELINE_ERROR,
    // Set the message param if users shall see the error message
    message: error.message,
    params: {
      // Expose the error details as params.
      pipelineName: name,
      request: input,
      errorCode: error.code,
      message: error.message,
    },
  }));
};

export default pipelineErrorDialog;
