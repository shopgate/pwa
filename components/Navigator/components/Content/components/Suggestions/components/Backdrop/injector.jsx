import React from 'react';
import { NavigatorContext } from '../../../../../../context';

export default Component => () => (
  <NavigatorContext.Consumer>
    {({ toggleSearchField }) => (
      <Component toggleSearchField={toggleSearchField} />
    )}
  </NavigatorContext.Consumer>
);

