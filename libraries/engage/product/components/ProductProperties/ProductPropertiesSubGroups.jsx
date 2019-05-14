import React from 'react';
import PropTypes from 'prop-types';
import { getSubgroupsFromProperties } from './helpers/getSubgroupsFromProperties';
import { ProductPropertiesRowGrouped } from './ProductPropertiesRowGrouped';
import { ProductPropertiesRowGroup } from './ProductPropertiesRowGroup';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
export function ProductPropertiesSubGroups({ properties }) {
  const subGroups = getSubgroupsFromProperties(properties);

  return subGroups.map(group => (
    <React.Fragment key={group}>
      <ProductPropertiesRowGroup group={group} />
      <ProductPropertiesRowGrouped properties={properties} group={group} />
    </React.Fragment>
  ));
}

ProductPropertiesSubGroups.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
