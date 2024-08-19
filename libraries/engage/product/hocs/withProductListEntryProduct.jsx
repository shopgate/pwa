import React from 'react';
import { connect } from 'react-redux';
import withProductListEntry from './withProductListEntry';
import { getProduct } from '../selectors/product';

/**
 * Injects the product from the ProductListEntryContext into the wrapped component. The product
 * property name can be configured via the HOC options.
 * @param {Function} WrappedComponent The react component to wrap.
 * @param {Object} [options={}] Options for the HOC.
 * @param {string} [options.prop="product"] An optional prop name to inject the
 * product into the wrapped component.
 * @returns {Function}
 */
export default function withProductListEntryProduct(WrappedComponent, options = {}) {
  const injectedProp = options.prop || 'product';
  /**
   * @return {Function} The extended component props.
   */
  const makeMapStateToProps = () => (state, props) => {
    const propProductId = props?.product?.id;
    const productListEntryProductId = props?.productListEntry?.productId;

    // Only select a new product from Redux when the current props don't contain a product yet
    const selectNewProduct =
      typeof propProductId === 'undefined' ||
      propProductId !== productListEntryProductId;

    return {
      [injectedProp]: selectNewProduct
        ? getProduct(state, { productId: productListEntryProductId })
        : props.product,
    };
  };

  const connector = connect(makeMapStateToProps);

  return (props) => {
    const Connected = withProductListEntry(connector(WrappedComponent));

    return (<Connected {...props} />);
  };
}
