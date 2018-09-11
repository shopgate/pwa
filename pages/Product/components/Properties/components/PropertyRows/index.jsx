import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PropertyRows = ({ properties }) => properties.map(({ label, value }) => (
  <tr key={`${label}${value}`}>
    <td className={styles}>{label}</td>
    <td className={styles} data-test-id={`property: ${value}`}>{value}</td>
  </tr>
));

PropertyRows.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default PropertyRows;
