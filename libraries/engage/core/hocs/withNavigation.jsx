import React from 'react';
import { push, pop, replace, reset, update } from '../router/helpers';

/**
 * Gets the navigation props for the wrapped component.
 * @param {string|null} prop The optional prop name.
 * @returns {Object}
 */
const getInjectedProps = (prop) => {
  const injected = {
    historyPush: push,
    historyPop: pop,
    historyReplace: replace,
    historyReset: reset,
    historyUpdate: update,
  };

  if (!prop) {
    return injected;
  }

  return {
    [prop]: { ...injected },
  };
};

/**
 * Injects navigation functions into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {Object} [options] A optional prop name to inject the navigation properties.
 * @param {string} [options.prop] An optional prop name to inject the navigation properties.
 * @returns {JSX}
 */
export function withNavigation(WrappedComponent, options = {}) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithNavigation = props => (
    <WrappedComponent
      {...props}
      {...getInjectedProps(options.prop)}
    />
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithNavigation.displayName = `WithNavigation(${displayName})`;

  return WithNavigation;
}
