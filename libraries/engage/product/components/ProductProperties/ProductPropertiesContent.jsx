import React from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '../../../core';
import { getGroupsFromProperties } from './helpers/getGroupsFromProperties';
import ProductPropertiesGrouped from './ProductPropertiesGrouped';
import ProductPropertiesWrapper from './ProductPropertiesWrapper';
import ProductPropertiesRows from './ProductPropertiesRows';
import { groupsContainer } from './ProductProperties.style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductPropertiesContent = ({ properties }) => {
  if (!properties) {
    return null;
  }

  const groups = getGroupsFromProperties(properties);

  // Display the simple properties if no groups exist or if not in beta mode.
  if (!isBeta() || !groups || groups.length === 0) {
    return (
      <ProductPropertiesWrapper>
        <ProductPropertiesRows properties={properties} />
      </ProductPropertiesWrapper>
    );
  }

  /*
    This feature is currently in BETA testing.
    It should only be used for approved BETA Client Projects
  */
  return (
    <div className={groupsContainer}>
      <ProductPropertiesGrouped properties={properties} groups={groups} />
    </div>
  );
};

ProductPropertiesContent.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesContent.defaultProps = {
  properties: null,
};

export default ProductPropertiesContent;
