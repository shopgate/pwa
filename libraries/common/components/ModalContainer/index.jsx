import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

export const MODAL_EVENTS = {
  SHOW: 'Modal.show',
  HIDE: 'Modal.hide',
};

/**
 * The ModalContainer is connected to the modal state
 * and renders the currently active modal.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ModalContainer = ({
  component,
  confirm,
  dismiss,
  modal,
}) => {
  if (!modal) {
    return null;
  }

  const componentProps = {
    modal,
    // A11Y focus is handled by the modal container itself.
    onConfirm: () => confirm(modal.id),
    onDismiss: () => dismiss(modal.id),
  };

  if (React.isValidElement(component)) {
    return React.cloneElement(component, componentProps);
  }

  return React.createElement(component, componentProps);
};

ModalContainer.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]).isRequired,
  confirm: PropTypes.func,
  dismiss: PropTypes.func,
  modal: PropTypes.shape(),
};

ModalContainer.defaultProps = {
  confirm: () => {},
  dismiss: () => {},
  modal: null,
};

export default connect(ModalContainer);
