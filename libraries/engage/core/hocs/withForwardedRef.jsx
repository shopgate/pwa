import React, { forwardRef } from 'react';

/**
 * Provides a wrapper for components that utilize forwarded refs. It accepts a ref via props,
 * and passes it down as a prop called forwardedRef.
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withForwardedRef(WrappedComponent) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @param {Object} ref The forwarded ref.
   * @returns {JSX}
   */
  const handle = (props, ref) => <WrappedComponent {...props} forwardedRef={ref} />;

  const name = WrappedComponent.displayName || WrappedComponent.name;
  handle.displayName = `withForwardedRef(${name})`;

  return forwardRef(handle);
}
