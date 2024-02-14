import React from 'react';
import ProductListTypeContext from '../providers/ProductListType/context';

/**
 * Injects the ProductListTypeContext properties into the desired component. Properties will be
 * accessible via the "productListType" prop.
 *
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export default function withProductListType(WrappedComponent) {
  /**
   * The actual HOC.
   * @param {Object} props The component props.
   * @returns {JSX}
   */
  const WithApp = props => (
    <ProductListTypeContext.Consumer>
      {contextValue => <WrappedComponent {...props} productListType={contextValue} />}
    </ProductListTypeContext.Consumer>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithApp.displayName = `WithProductListType(${displayName})`;

  return WithApp;
}

