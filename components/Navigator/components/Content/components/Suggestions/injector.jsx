import React from 'react';
import { NavigatorContext } from '../../../../context';

export default Component => () => (
  <NavigatorContext>
    {({ searchField }) => (
      <Component isVisible={searchField} />
    )}
  </NavigatorContext>
);
