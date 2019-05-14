import React from 'react';
import PropTypes from 'prop-types';
import { tableCell } from './ProductProperties.style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
export function ProductPropertiesRow({ label, value }) {
  return (
    <tr key={`${label}${value}`}>
      <td className={tableCell}>{label}</td>
      <td className={tableCell} data-test-id={`property: ${value}`}>{value}</td>
    </tr>
  );
}

ProductPropertiesRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
