import React from 'react';
import { push, pop, replace, reset } from '../router/helpers';

/**
 * Injects navigation functions into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withNavigation(WrappedComponent) {
  return props => (
    <WrappedComponent
      {...props}
      push={push}
      pop={pop}
      replace={replace}
      reset={reset}
    />
  );
}
