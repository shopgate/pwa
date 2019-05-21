import React from 'react';
import PropTypes from 'prop-types';
import ProductPropertiesRow from './ProductPropertiesRow';

/**
 * Renders rows of product properties.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ProductPropertiesRows = ({ properties }) => properties
  .map(({ value, label }) => (
    <ProductPropertiesRow key={`${label}-${value}`} label={label} value={value} />
  ));

ProductPropertiesRows.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default React.memo(ProductPropertiesRows);
