import React from 'react';
import { NavigatorContext } from '../../../../../../context';

export default Component => props => (
  <NavigatorContext.Consumer>
    {({ searchQuery, toggleSearchField }) => (
      <Component
        searchPhrase={searchQuery}
        toggleSearchField={toggleSearchField}
        {...props}
      />
    )}
  </NavigatorContext.Consumer>
);
