import React from 'react';
import { ThemeContext } from '@shopgate/pwa-common/context';

/**
 * Injects the current Product Context information into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withCurrentProduct(WrappedComponent) {
  return props => (
    <ThemeContext.Consumer>
      {({ contexts: { ProductContext } }) => (
        <ProductContext.Consumer>
          {productProps => <WrappedComponent {...productProps} {...props} />}
        </ProductContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
