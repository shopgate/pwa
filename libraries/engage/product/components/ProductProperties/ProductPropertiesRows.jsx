import React from 'react';
import PropTypes from 'prop-types';
import { tableCell } from './ProductProperties.style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
export function ProductPropertiesRows({ properties }) {
  return properties.map(({ label, value }) => (
    <tr key={`${label}${value}`}>
      <td className={tableCell}>{label}</td>
      <td className={tableCell} data-test-id={`property: ${value}`}>{value}</td>
    </tr>
  ));
}

ProductPropertiesRows.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
