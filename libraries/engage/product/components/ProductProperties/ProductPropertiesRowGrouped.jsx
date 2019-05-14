import React from 'react';
import PropTypes from 'prop-types';
import { getPropertiesBySubgroup } from './helpers/getPropertiesBySubgroup';
import { ProductPropertiesRow } from './ProductPropertiesRow';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function ProductPropertiesRowGrouped({ properties, group }) {
  const filteredProperties = getPropertiesBySubgroup(properties, group);

  return filteredProperties.map(({ label, value }) => (
    <ProductPropertiesRow key={`${label}-${value}`} label={label} value={value} />
  ));
}

ProductPropertiesRowGrouped.propTypes = {
  group: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
