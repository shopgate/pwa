import React from 'react';
import { push, pop, replace, reset, update } from '../router/helpers';

/**
 * Injects navigation functions into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withNavigation(WrappedComponent) {
  return props => (
    <WrappedComponent
      {...props}
      historyPush={push}
      historyPop={pop}
      historyReplace={replace}
      historyReset={reset}
      historyUpdate={update}
    />
  );
}
