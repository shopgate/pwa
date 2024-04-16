import React from 'react';
import ProductListEntryContext from '../providers/ProductListEntry/context';

/**
 * Injects the ProductListEntryContext properties into the desired component. Properties will be
 * accessible via the "productListEntry" prop.
 *
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export default function withProductListEntry(WrappedComponent) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithApp = props => (
    <ProductListEntryContext.Consumer>
      {contextValue => <WrappedComponent {...props} productListEntry={contextValue} />}
    </ProductListEntryContext.Consumer>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithApp.displayName = `WithProductListEntry(${displayName})`;

  return WithApp;
}

