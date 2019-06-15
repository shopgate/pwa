import React from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';

/**
 * Gets the context props for the wrapped component.
 * @param {Object} context The context.
 * @param {string|null} prop The optional prop name.
 * @returns {Object}
 */
const getInjectedProps = (context, prop) => {
  if (!prop) {
    return context;
  }

  return {
    [prop]: { ...context },
  };
};

/**
 * Injects the route properties into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {Object} [options={}] Options for the HOC.
 * @param {string} [options.prop] An optional prop name to inject the route properties.
 * @returns {JSX}
 */
export function withRoute(WrappedComponent, options = {}) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithRoute = props => (
    <RouteContext.Consumer>
      {routeContext => (
        <WrappedComponent {...props} {...getInjectedProps(routeContext, options.prop)} />
      )}
    </RouteContext.Consumer>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithRoute.displayName = `WithRoute(${displayName})`;

  return WithRoute;
}
