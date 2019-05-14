import React from 'react';
import PropTypes from 'prop-types';
import { ProductPropertiesRowUngrouped } from './ProductPropertiesRowUngrouped';
import { ProductPropertiesSubGroups } from './ProductPropertiesSubGroups';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
export function ProductPropertiesRows({ properties }) {
  return (
    <React.Fragment>
      <ProductPropertiesRowUngrouped properties={properties} />
      <ProductPropertiesSubGroups properties={properties} />
    </React.Fragment>
  );
}

ProductPropertiesRows.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
