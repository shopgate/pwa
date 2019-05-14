import React from 'react';
import PropTypes from 'prop-types';
import { subgroup } from './ProductProperties.style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
export function ProductPropertiesRowGroup({ group }) {
  return (
    <tr>
      <td colSpan="2" className={subgroup}>{group}</td>
    </tr>
  );
}

ProductPropertiesRowGroup.propTypes = {
  group: PropTypes.string.isRequired,
};
