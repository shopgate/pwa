import React from 'react';
import { ThemeContext } from '@shopgate/pwa-common/context';

/**
 * Injects the theme API into the desired component. This does not include the contexts.
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withTheme(WrappedComponent) {
  return props => (
    <ThemeContext.Consumer>
      {({ contexts, ...themeContext }) => ( // The contexts are left out in favor of other HOCs.
        <WrappedComponent {...themeContext} {...props} />
      )}
    </ThemeContext.Consumer>
  );
}
