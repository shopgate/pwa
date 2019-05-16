import React from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '../../../core';
import { ProductPropertiesSimple } from './ProductPropertiesSimple';
import { ProductPropertiesGrouped } from './ProductPropertiesGrouped';
import connect from './ProductProperties.connector';

/**
 * The product properties.
 * @returns {JSX}
 */
function ProductPropertiesContainer({ properties }) {
  if (!properties) {
    return null;
  }

  if (!isBeta()) { // TODO: Can be removed once the beta phase (product) is over!
    return <ProductPropertiesSimple properties={properties} />;
  }

  /*
    This feature is currently in BETA testing.
    It should only be used for approved BETA Client Projects
  */
  return (
    <ProductPropertiesGrouped properties={properties} />
  );
}

ProductPropertiesContainer.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesContainer.defaultProps = {
  properties: null,
};

export const ProductProperties = connect(ProductPropertiesContainer);
