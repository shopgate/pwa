import React from 'react';
import PropTypes from 'prop-types';

/**
 * The TimeRemaining component.
 * @param {Object} props The component props.
 * @param {Object} props.timestamp A unix timestamp.
 * @returns {JSX}
 */
function TimeRemaining({ timestamp }) {
  return (
    <div>
      {timestamp}
    </div>
  );
}

TimeRemaining.propTypes = {
  timestamp: PropTypes.number.isRequired,
};

export default TimeRemaining;
