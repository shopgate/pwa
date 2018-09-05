import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { ViewContext } from '../../context';

const map = {
  top: 'top',
};

/**
 * @returns {JSX}
 */
const ViewAbove = () => (
  <Consume context={ViewContext} props={map}>
    {({ top }) => <div aria-hidden style={{ flexShrink: 0, height: `${top}px` }} />}
  </Consume>
);

export default ViewAbove;

