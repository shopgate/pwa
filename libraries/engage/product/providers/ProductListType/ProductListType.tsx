import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './context';

/**
 * The ProductListTypeProvider is usually wrapped around components that render product lists.
 * It provides information about the type / purpose of those product lists which can be used
 * by child components or extensions to determine how they are supposed to render their content.
 *
 * Context values can be accessed via the `useProductListType` hook, or injected into a class
 * component via the `withProductListType` HOC. Both can be imported from `@shopgate/engage/product`
 *
 * @param {Object} param The component props
 * @param {string} param.type Type of the context e.g. "productSlider" or "productGrid".
 * @param {string} param.subType Optional sub type of the context. Depending on its usage it can
 * make a statement about in which context the product list is used e.g. "widgets".
 * @param {Object} param.meta Optional meta information that can be used by child components
 * @returns {JSX}
 */
function ProductListTypeProvider({
  children,
  type,
  subType,
  meta,
}) {
  const value = useMemo(() => ({
    type,
    subType,
    meta,
  }), [meta, subType, type]);

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
}

ProductListTypeProvider.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node,
  meta: PropTypes.shape(),
  subType: PropTypes.string,
};

ProductListTypeProvider.defaultProps = {
  children: null,
  subType: null,
  meta: null,
};

export default ProductListTypeProvider;
