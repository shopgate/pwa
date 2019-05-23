import React from 'react';
import { createPortal } from 'react-dom';
import { SnackBar } from '@shopgate/engage/components';

/**
 * The SnackBarContainer component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function SnackBarContainer(props) {
  if (!props.toasts.length) {
    return null;
  }

  return (
    createPortal(
      <SnackBar {...props} />,
      document.getElementById('AppFooter')
    )
  );
}

export default SnackBarContainer;
