import React, { forwardRef } from 'react';

/**
 * Provides a wrapper for components that utilize forwarded refs. It accepts a ref via props,
 * and passes it down as a prop called forwardedRef.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {Object} [options={}] Options for the HOC.
 * @param {string} [options.prop='forwardedRef'] The prop for the forwarded ref.
 * @returns {JSX}
 */
export function withForwardedRef(WrappedComponent, options = {}) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @param {Object} ref The forwarded ref.
   * @returns {JSX}
   */
  const WithForwardedRef = (props, ref) => {
    const injected = {
      [options.prop || 'forwardedRef']: ref,
    };
    return <WrappedComponent {...props} {...injected} />;
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithForwardedRef.displayName = `WithForwardedRef(${displayName})`;

  return forwardRef(WithForwardedRef);
}
