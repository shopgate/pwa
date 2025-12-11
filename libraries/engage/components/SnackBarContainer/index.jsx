import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { SnackBar } from '@shopgate/pwa-ui-material';

/**
 * The SnackBarContainer component.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
function SnackBarContainer(props) {
  if (!props.toasts.length) {
    return null;
  }

  return (
    createPortal(
      <SnackBar {...props} />,
      document.getElementById('portals')
    )
  );
}

SnackBarContainer.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape()),
};

SnackBarContainer.defaultProps = {
  toasts: [],
};

export default SnackBarContainer;
