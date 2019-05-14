import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/pwa-common/components';
import { PRODUCT_PROPERTIES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { getGroupsFromProperties } from './helpers/getGroupsFromProperties';
import { ProductPropertiesGroups } from './ProductPropertiesGroups';
import { ProductPropertiesSimple } from './ProductPropertiesSimple';
import { groupsContainer } from './ProductProperties.style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function ProductPropertiesGrouped({ properties }) {
  const groups = getGroupsFromProperties(properties);

  // Display the simple properties if no groups exist.
  if (groups.length === 0) {
    return <ProductPropertiesSimple properties={properties} />;
  }

  return (
    <SurroundPortals portalName={PRODUCT_PROPERTIES}>
      {(properties !== null && properties.length !== 0) && (
        <div className={groupsContainer}>
          <ProductPropertiesGroups properties={properties} groups={groups} />
        </div>
      )}
    </SurroundPortals>
  );
}

ProductPropertiesGrouped.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPropertiesGrouped.defaultProps = {
  properties: null,
};
