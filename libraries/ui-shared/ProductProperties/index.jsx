import React from 'react';
import PropTypes from 'prop-types';

/**
 * The Cart Product Properties component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Properties = ({ properties }) => {
  if (!properties.length) {
    return null;
  }

  return (
    <ul>
      {properties.map(({ label, value }) => (
        <li key={`${label}-${value}`}>
          {label}: {value}
        </li>
      ))}
    </ul>
  );
};

Properties.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

Properties.defaultProps = {
  properties: [],
};

export default Properties;
