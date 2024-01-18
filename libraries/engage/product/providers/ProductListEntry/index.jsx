import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useProductListType from '../../hooks/useProductListType';
import Context from './context';

/**
 * The ProductListEntryProvider is usually wrapped around components that render products and
 * provides basic information about them.
 *
 * Context values can be accessed via the `useProductListEntry` hook, or injected into a class
 * component via the `withProductListEntry` HOC. Both can be imported via `@shopgate/engage/product`
 *
 * @param {Object} param The component props
 * @param {string} param.productId Product identifier.
 * @returns {JSX}
 */
function ProductListEntryProvider({
  children,
  productId,
}) {
  const {
    type,
    subType,
  } = useProductListType();

  const value = useMemo(() => ({
    productListType: type,
    productListSubType: subType,
    productId,
  }), [productId, subType, type]);

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
}

ProductListEntryProvider.propTypes = {
  productId: PropTypes.string.isRequired,
  children: PropTypes.node,
};

ProductListEntryProvider.defaultProps = {
  children: null,
};

export default ProductListEntryProvider;

