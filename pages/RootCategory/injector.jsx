import React from 'react';
import { RouteContext } from '@virtuous/react-conductor/Router';

export default Component => () => (
  <RouteContext>
    {({ open }) => (
      <Component open={open} />
    )}
  </RouteContext>
);
