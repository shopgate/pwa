import React from 'react';
import PropTypes from 'prop-types';
import { tableCell } from './ProductProperties.style';

/**
 * Renders a single properties row.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const ProductPropertiesRow = ({ label, value }) => (
  <tr key={`${label}${value}`}>
    <td className={tableCell}>{label}</td>
    <td className={tableCell} data-test-id={`property: ${value}`}>{value}</td>
  </tr>
);

ProductPropertiesRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default React.memo(ProductPropertiesRow);
