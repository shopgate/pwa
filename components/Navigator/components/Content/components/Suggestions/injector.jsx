import React from 'react';
import { NavigatorContext } from '../../../../context';

export default Component => () => (
  <NavigatorContext.Consumer>
    {({ searchField }) => (
      <Component isVisible={searchField} />
    )}
  </NavigatorContext.Consumer>
);
