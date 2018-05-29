import React from 'react';
import PropTypes from 'prop-types';
import ProductGrid from 'Components/ProductGrid';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Products = (props) => {
  if (!props.products) return null;
  return (
    <ProductGrid
      handleGetProducts={props.getProducts}
      products={props.products}
      totalProductCount={props.totalProductCount}
    />
  );
};

Products.propTypes = {
  getProducts: PropTypes.func,
  products: PropTypes.arrayOf(PropTypes.shape()),
  totalProductCount: PropTypes.number,
};

Products.defaultProps = {
  getProducts: () => {},
  products: null,
  totalProductCount: null,
};

export default connect(Products);
