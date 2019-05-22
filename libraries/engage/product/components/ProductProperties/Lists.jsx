import React from 'react';
import PropTypes from 'prop-types';
import { getSubgroupsFromProperties } from './helpers/getSubgroupsFromProperties';
import { getPropertiesWithoutSubgroup } from './helpers/getPropertiesWithoutSubgroup';
import { getPropertiesBySubgroup } from './helpers/getPropertiesBySubgroup';
import Group from './Group';
import Rows from './Rows';

/**
 * Renders lists of properties that are eventually grouped.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Lists = ({ properties }) => (
  <React.Fragment>
    <Rows properties={getPropertiesWithoutSubgroup(properties)} />
    {getSubgroupsFromProperties(properties).map(group => (
      <React.Fragment key={group}>
        <Group group={group} />
        <Rows properties={getPropertiesBySubgroup(properties, group)} />
      </React.Fragment>
    ))}
  </React.Fragment>
);

Lists.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default Lists;
