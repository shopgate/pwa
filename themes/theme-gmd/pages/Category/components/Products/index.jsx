import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/config/isBeta';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import ProductGrid from 'Components/ProductGrid';
import connect from './connector';

const { colors } = themeConfig;

const categoryProductsSeparatorStyle = {
  margin: 0,
  borderTop: `1px solid ${colors.shade7}`,
  borderBottom: 'none',
};

/**
 * The Category products component.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
const CategoryProducts = ({
  sort,
  categoryHasChildren,
  categoryId,
  getProducts,
  hash,
  products,
  totalProductCount,
}) => {
  const fetchProducts = useCallback((offset) => {
    const includeCharacteristics = isBeta();
    const length = Array.isArray(products) ? products.length : 0;

    return getProducts(
      categoryId,
      sort,
      offset || length,
      includeCharacteristics
    );
  }, [categoryId, sort, products, getProducts]);

  const hasProducts = Array.isArray(products) && products.length > 0;

  return (
    <>
      { (categoryHasChildren && hasProducts) && (
        <ResponsiveContainer webOnly breakpoint=">xs">
          <hr style={categoryProductsSeparatorStyle} />
        </ResponsiveContainer>
      )}
      <ProductGrid
        handleGetProducts={fetchProducts}
        products={products}
        totalProductCount={totalProductCount}
        requestHash={hash}
        scope="category"
      />
    </>
  );
};

CategoryProducts.propTypes = {
  sort: PropTypes.string.isRequired,
  categoryHasChildren: PropTypes.bool,
  categoryId: PropTypes.string,
  getProducts: PropTypes.func,
  hash: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.shape()),
  totalProductCount: PropTypes.number,
};

CategoryProducts.defaultProps = {
  categoryId: null,
  categoryHasChildren: false,
  getProducts() { },
  hash: null,
  products: null,
  totalProductCount: null,
};

export default connect(CategoryProducts);
