import React, { useContext } from 'react';
import { ThemeContext, RouteContext } from '@shopgate/pwa-common/context';

/**
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withCustomRoute(WrappedComponent) {
  const themeContext = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);

  return props => (
    <WrappedComponent {...themeContext} {...routeContext} {...props} />
  );
}
