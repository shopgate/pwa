/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

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
