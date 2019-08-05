import React from 'react';
import { ThemeContext } from '@shopgate/pwa-common/context';

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
 * Injects the theme API into the desired component. This does not include the contexts.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {Object} [options={}] Options for the HOC.
 * @param {string} [options.prop] An optional prop name to inject the theme properties.
 * @returns {JSX}
 */
export function withTheme(WrappedComponent, options = {}) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithTheme = props => (
    <ThemeContext.Consumer>
      {({ contexts, ...themeContext }) => ( // The contexts are left out in favor of other HOCs.
        <WrappedComponent {...getInjectedProps(themeContext, options.prop)} {...props} />
      )}
    </ThemeContext.Consumer>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithTheme.displayName = `WithTheme(${displayName})`;

  return WithTheme;
}
