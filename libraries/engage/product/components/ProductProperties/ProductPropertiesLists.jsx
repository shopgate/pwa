import React from 'react';
import PropTypes from 'prop-types';
import { getSubgroupsFromProperties } from './helpers/getSubgroupsFromProperties';
import { getPropertiesWithoutSubgroup } from './helpers/getPropertiesWithoutSubgroup';
import { getPropertiesBySubgroup } from './helpers/getPropertiesBySubgroup';
import ProductPropertiesGroup from './ProductPropertiesGroup';
import ProductPropertiesRows from './ProductPropertiesRows';

/**
 * Renders lists of properties that are eventually grouped.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductPropertiesLists = ({ properties }) => (
  <React.Fragment>
    <ProductPropertiesRows properties={getPropertiesWithoutSubgroup(properties)} />
    {getSubgroupsFromProperties(properties).map(group => (
      <React.Fragment key={group}>
        <ProductPropertiesGroup group={group} />
        <ProductPropertiesRows properties={getPropertiesBySubgroup(properties, group)} />
      </React.Fragment>
    ))}
  </React.Fragment>
);

ProductPropertiesLists.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ProductPropertiesLists;
