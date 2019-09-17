import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import connect from './connector';

export const MODAL_EVENTS = {
  SHOW: 'Modal.show',
  HIDE: 'Modal.hide',
};

/**
 * The ModalContainer is connected to the modal state
 * and renders the currently active modal.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const ModalContainer = ({
  component,
  confirm,
  dismiss,
  modal,
}) => {
  const ref = useRef(false);
  useEffect(() => {
    if (modal && !ref.current) {
      ref.current = true;
      UIEvents.emit(MODAL_EVENTS.SHOW);
    }
    if (!modal && ref.current) {
      ref.current = false;
      UIEvents.emit(MODAL_EVENTS.HIDE);
    }
  }, [modal]);

  if (!modal) {
    return null;
  }

  const componentProps = {
    modal,
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
