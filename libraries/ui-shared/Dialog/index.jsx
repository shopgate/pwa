import React, { useRef, useEffect } from 'react';
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
  DIALOG_HTML_CONTENT,
} from './constants';
import PipelineErrorDialog from './components/PipelineErrorDialog';
import TextMessageDialog from './components/TextMessageDialog';
import HtmlContentDialog from './components/HtmlContentDialog';
import BasicDialog from './components/BasicDialog';
import VariantSelectModal from './components/VariantSelectModal';

const dialogTypes = {
  [DIALOG_TEXT_MESSAGE]: TextMessageDialog,
  [DIALOG_HTML_CONTENT]: HtmlContentDialog,
  [MODAL_PIPELINE_ERROR]: PipelineErrorDialog,
  [MODAL_VARIANT_SELECT]: VariantSelectModal,
};

/**
 * The main component for rendering dialogs.
 * This component takes care of choosing the correct component body for the given type
 * and render it on a modal overlay.
 * @param {Object} props The component props.
 * @param {Object} props.modal Object with modal data.
 * @param {Function} props.onConfirm The function to call when the confirm button is clicked.
 * @param {Function} props.onDismiss The function to call when the dismiss button is clicked.
 * @param {NodeList} props.children The children to render inside the modal.
 * @returns {JSX.Element}
 */
const Dialog = ({
  modal, onConfirm, onDismiss, children,
}) => {
  // Assemble the actions.
  const actions = [];
  const {
    confirm, dismiss, title, titleParams, message, params, type, confirmDisabled, dismissDisabled,
  } = modal;

  // Push dismiss action first so the button is rendered first
  if (dismiss) {
    // We have a dismiss label, add a dismiss action.
    actions.push({
      label: modal.dismiss,
      action: onDismiss,
      type: MODAL_ACTION_TYPE_PRIMARY,
      disabled: dismissDisabled,
    });
  }

  if (confirm) {
    // We have a confirm label, add a confirm action.
    actions.push({
      label: modal.confirm,
      action: onConfirm,
      type: MODAL_ACTION_TYPE_NORMAL,
      disabled: confirmDisabled,
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
    children,
  };

  const DialogComponent = dialogTypes[dialogType] || BasicDialog;

  const modalRef = useRef(null);

  // Effect to toggle aria-hidden on all other modals when the dialog is open.
  useEffect(() => {
    const otherModals = document.querySelectorAll('.common__modal:not(.ui-shared__dialog-modal), .engage__sheet-drawer');

    otherModals.forEach((entry) => {
      entry.setAttribute('aria-hidden', 'true');
    });

    return () => {
      otherModals.forEach((entry) => {
        entry.removeAttribute('aria-hidden');
      });
    };
  }, []);

  return (
    <Modal ref={modalRef} classes={{ container: 'ui-shared__dialog-modal' }}>
      <Backdrop isVisible level={0} opacity={30} />
      <DialogComponent {...dialogProps} />
    </Modal>
  );
};

Dialog.propTypes = {
  modal: PropTypes.shape({
    /**
     * The title of the modal.
     */
    title: BasicDialog.propTypes.title,
    /**
     * Additional I18n placeholder parameters for the title.
     */
    titleParams: PropTypes.shape(),
    /**
     * Label for the confirm button.
     */
    confirm: PropTypes.string,
    /**
     * Label for the dismiss button.
     */
    dismiss: PropTypes.string,
    /**
     * Message to be displayed in the modal.
     */
    message: PropTypes.string,
    /**
     * Additional parameters for the component that's used to render the dialog.
     */
    params: PropTypes.shape(),
    /**
     * Type of the dialog.
     * This is used to determine which component to render.
     */
    type: PropTypes.string,
    /**
     * Whether the confirm button is disabled when visible
     */
    confirmDisabled: PropTypes.bool,
    /**
     * Whether the dismiss button is disabled when visible
     */
    dismissDisabled: PropTypes.bool,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
};

Dialog.defaultProps = {
  onConfirm: () => {},
  onDismiss: () => {},
  children: null,
};

export default Dialog;
