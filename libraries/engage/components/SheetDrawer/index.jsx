import React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';
import { Sheet } from '@shopgate/engage/components';

const node = document.getElementById('portals');

/**
 * @param {Object} props The props to be passed to the Sheet.
 * @returns {JSX.Element}
 */
function SheetDrawer(props) {
  // Track modal visibility for accessibility purposes.
  useTrackModalState(props.isOpen);

  return (
    createPortal(
      <Sheet {...props} className={classNames(props.className, 'engage__sheet-drawer')} />,
      node
    )
  );
}

export default SheetDrawer;
