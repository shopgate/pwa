import React from 'react';
import { NavigatorContext } from '../../../../../../context';

export default Component => () => (
  <NavigatorContext>
    {({ toggleSearchField }) => (
      <Component toggleSearchField={toggleSearchField} />
    )}
  </NavigatorContext>
);

