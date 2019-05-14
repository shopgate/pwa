import React from 'react';
import PropTypes from 'prop-types';
import { getPropertiesWithoutSubgroup } from './helpers/getPropertiesWithoutSubgroup';
import { ProductPropertiesRow } from './ProductPropertiesRow';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
export function ProductPropertiesRowUngrouped({ properties }) {
  const filteredProperties = getPropertiesWithoutSubgroup(properties);

  return filteredProperties.map(({ label, value }) => (
    <ProductPropertiesRow key={`${label}-${value}`} label={label} value={value} />
  ));
}

ProductPropertiesRowUngrouped.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
