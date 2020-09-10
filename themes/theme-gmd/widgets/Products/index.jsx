import React from 'react';
import PropTypes from 'prop-types';
import ProductsIdsWidget from './ProductsIdsWidget';
import ProductsWidget from './ProductsWidget';

// Inherited types
const types = {
  4: ProductsIdsWidget,
};

/**
 * @param {Object} settings .
 * @param {Object} props .
 * @returns {JSX}
 */
const ProductsWidgets = ({ settings, ...props }) => {
  const { queryType } = settings;

  /** @type {ProductsWidget} */
  const TypeRenderer = types[queryType] || ProductsWidget;

  return (
    <TypeRenderer settings={settings} {...props} />
  );
};

ProductsWidgets.propTypes = {
  settings: PropTypes.shape().isRequired,
};

export default ProductsWidgets;
