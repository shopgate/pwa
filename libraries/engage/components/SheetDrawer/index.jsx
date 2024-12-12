import React from 'react';
import { Sheet, ConnectedReactDOMPortal } from '@shopgate/engage/components';

const node = document.getElementById('portals');

/**
 * @param {Object} props The props to be passed to the Sheet.
 * @returns {JSX}
 */
function SheetDrawer(props) {
  return (
    <ConnectedReactDOMPortal domNode={node}>
      <Sheet {...props} />
    </ConnectedReactDOMPortal>
  );
}

export default SheetDrawer;
