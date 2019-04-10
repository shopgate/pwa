import React from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';

/**
 * Injects the route properties into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withRoute(WrappedComponent) {
  return props => (
    <RouteContext.Consumer>
      {routeContext => (
        <WrappedComponent {...routeContext} {...props} />
      )}
    </RouteContext.Consumer>
  );
}
