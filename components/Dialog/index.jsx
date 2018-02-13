/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@shopgate/pwa-common/components/Modal';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import {
  DIALOG_TEXT_MESSAGE,
  MODAL_VARIANT_SELECT,
} from './constants';
import PipelineErrorDialog from './components/PipelineErrorDialog';
import TextMessageDialog from './components/TextMessageDialog';
import BasicDialog from './components/BasicDialog';
import VariantSelectModal from './components/VariantSelectModal';

/**
 * The main component for rendering dialogs.
 * This component takes care of choosing the correct component body for the given type
 * and render it on a modal overlay.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Dialog = ({ modal, onConfirm, onDismiss }) => {
  // Assemble the actions.
  const actions = [];
  const { confirm, dismiss, title, params, message, type } = modal;

  if (confirm) {
    // We have a confirm label, add a confirm action.
    actions.push({
      label: modal.confirm,
      action: onConfirm,
    });
  }

  if (dismiss) {
    // We have a dismiss label, add a dismiss action.
    actions.push({
      label: modal.dismiss,
      action: onDismiss,
    });
  }

  let dialogType = type;

  if (!dialogType && message) {
    dialogType = DIALOG_TEXT_MESSAGE;
  }

  switch (dialogType) {
    case MODAL_PIPELINE_ERROR:
      return (
        <Modal>
          <Backdrop isVisible level={0} />
          <PipelineErrorDialog actions={actions} title={title} params={params} message={message} />
        </Modal>
      );
    case DIALOG_TEXT_MESSAGE:
      return (
        <Modal>
          <Backdrop isVisible level={0} />
          <TextMessageDialog actions={actions} title={title} params={params} message={message} />
        </Modal>
      );
    case MODAL_VARIANT_SELECT:
      return (
        <Modal>
          <Backdrop isVisible level={0} />
          <VariantSelectModal actions={actions} title={title} params={params} message={message} />
        </Modal>
      );
    default:
      return (
        <Modal>
          <Backdrop isVisible level={0} />
          <BasicDialog actions={actions} title={title} params={params} />
        </Modal>
      );
  }
};

Dialog.propTypes = {
  modal: PropTypes.shape({
    title: PropTypes.string,
    confirm: PropTypes.string,
    dismiss: PropTypes.string,
    message: PropTypes.string,
    params: PropTypes.shape(),
  }).isRequired,
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
};

Dialog.defaultProps = {
  onConfirm: () => {},
  onDismiss: () => {},
};

export default Dialog;
