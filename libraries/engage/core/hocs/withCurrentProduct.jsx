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
 * Injects the current Product Context information into the desired component.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {Object} [options] A optional prop name to inject the current product properties.
 * @param {string} options.prop An optional prop name to inject the current product properties.
 * @returns {JSX}
 */
export function withCurrentProduct(WrappedComponent, options = {}) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithCurrentProduct = props => (
    <ThemeContext.Consumer>
      {({ contexts: { ProductContext } }) => (
        <ProductContext.Consumer>
          {productProps =>
            <WrappedComponent {...props} {...getInjectedProps(productProps, options.prop)} />}
        </ProductContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithCurrentProduct.displayName = `WithCurrentProduct(${displayName})`;

  return WithCurrentProduct;
}
