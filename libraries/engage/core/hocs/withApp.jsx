import React from 'react';
import AppContext from '../contexts/AppContext';

/**
 * Injects the AppContext properties into the desired component. It adds a new property "app".
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withApp(WrappedComponent) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithApp = props => (
    <AppContext.Consumer>
      {appContext => (
        <WrappedComponent app={appContext} {...props} />
      )}
    </AppContext.Consumer>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithApp.displayName = `WithApp(${displayName})`;

  return WithApp;
}
