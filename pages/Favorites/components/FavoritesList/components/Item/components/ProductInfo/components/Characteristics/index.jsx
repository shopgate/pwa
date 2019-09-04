import React from 'react';
import PropTypes from 'prop-types';

/**
 * The Favorites Characteristics component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Characteristics = ({ characteristics }) => (
  <ul>
    {characteristics.map(({ name, value }) => (
      <li key={`${name}-${value}`}>
        {name}
        {': '}
        {value}
      </li>
    ))}
  </ul>
);

Characteristics.propTypes = {
  characteristics: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

export default Characteristics;
