import React from 'react';
import PropTypes from 'prop-types';
import { getWeekDaysOrder } from '@shopgate/engage/core';
import StoreAddressOpeningHoursLine from './StoreAddressOpeningHoursLine';
import { openingHours } from './style';

/**
 * Renders the store's opening hours.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function StoreAddressOpeningHours({ hours }) {
  if (!hours) {
    return null;
  }

  return (
    <div className={openingHours}>
      {getWeekDaysOrder().map(weekDay => (
        <StoreAddressOpeningHoursLine hours={hours[weekDay]} code={weekDay} key={weekDay} />
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
