import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@shopgate/pwa-common/components/Modal';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import I18n from '@shopgate/pwa-common/components/I18n';
import {
  DIALOG_TEXT_MESSAGE,
  MODAL_VARIANT_SELECT,
  MODAL_ACTION_TYPE_PRIMARY,
  MODAL_ACTION_TYPE_NORMAL,
} from './constants';
import PipelineErrorDialog from './components/PipelineErrorDialog';
import TextMessageDialog from './components/TextMessageDialog';
import BasicDialog from './components/BasicDialog';
import VariantSelectModal from './components/VariantSelectModal';

const dialogTypes = {
  [DIALOG_TEXT_MESSAGE]: TextMessageDialog,
  [MODAL_PIPELINE_ERROR]: PipelineErrorDialog,
  [MODAL_VARIANT_SELECT]: VariantSelectModal,
};

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
  const {
    confirm, dismiss, title, titleParams, message, params, type,
  } = modal;

  // Push dismiss action first so the button is rendered first
  if (dismiss) {
    // We have a dismiss label, add a dismiss action.
    actions.push({
      label: modal.dismiss,
      action: onDismiss,
      type: MODAL_ACTION_TYPE_PRIMARY,
    });
  }

  if (confirm) {
    // We have a confirm label, add a confirm action.
    actions.push({
      label: modal.confirm,
      action: onConfirm,
      type: MODAL_ACTION_TYPE_NORMAL,
    });
  }

  let dialogType = type;

  if (!dialogType && message) {
    dialogType = DIALOG_TEXT_MESSAGE;
  }

  let dialogTitle = title;
  if (titleParams) {
    dialogTitle = <I18n.Text string={title} params={titleParams} />;
  }

  const dialogProps = {
    actions,
    title: dialogTitle,
    params,
    message: message || undefined,
  };

  const DialogComponent = dialogTypes[dialogType] || BasicDialog;

  return (
    <Modal>
      <Backdrop isVisible level={0} />
      <DialogComponent {...dialogProps} />
    </Modal>
  );
};

Dialog.propTypes = {
  modal: PropTypes.shape({
    title: BasicDialog.propTypes.title,
    titleParams: PropTypes.shape(),
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
