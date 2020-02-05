import React from 'react';
import PropTypes from 'prop-types';
import StoreAddressOpeningHoursLine from './StoreAddressOpeningHoursLine';
import { openingHours } from './style';

/**
 * Renders the store's opening hours.
 * @param {Object} props The compnent props.
 * @returns {JSX}
 */
function StoreAddressOpeningHours({ hours }) {
  if (!hours) {
    return null;
  }

  return (
    <div className={openingHours}>
      {Object.keys(hours).map(key => (
        <StoreAddressOpeningHoursLine hours={hours[key]} code={key} key={key} />
      ))}
    </div>
  );
}

StoreAddressOpeningHours.propTypes = {
  hours: PropTypes.shape(),
};

StoreAddressOpeningHours.defaultProps = {
  hours: null,
};

export default StoreAddressOpeningHours;
