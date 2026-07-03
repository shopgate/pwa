import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ItemCharacteristics = ({ characteristics }) => {
  if (!characteristics || characteristics.length === 0) {
    return null;
  }

  return (
    <ul>
      {characteristics.map(({ label, value }) => (
        <Typography variant="body2" component="li" color="textSecondary" key={`${label}-${value}`}>
          {label}
          {': '}
          {value}
        </Typography>
      ))}
    </ul>
  );
};

ItemCharacteristics.propTypes = {
  characteristics: PropTypes.arrayOf(PropTypes.shape()),
};

ItemCharacteristics.defaultProps = {
  characteristics: null,
};

export default ItemCharacteristics;
