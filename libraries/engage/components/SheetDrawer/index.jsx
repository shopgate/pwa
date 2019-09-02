import React from 'react';
import { createPortal } from 'react-dom';
import Sheet from '@shopgate/pwa-ui-shared/Sheet';

const node = document.getElementById('portals');

/**
 * @param {Object} props The props to be passed to the Sheet.
 * @returns {JSX}
 */
function SheetDrawer(props) {
  return (
    createPortal(
      <Sheet {...props} />,
      node
    )
  );
}

export default SheetDrawer;
