import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { ViewContext } from '../../context';

const map = {
  bottom: 'bottom',
};

/**
 * @returns {JSX}
 */
const ViewBelow = () => (
  <Consume context={ViewContext} props={map}>
    {({ bottom }) => <div aria-hidden style={{ flexShrink: 0, height: `calc(${bottom}px + var(--safe-area-inset-bottom))` }} />}
  </Consume>
);

export default ViewBelow;

