import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core';
import { storeHoursToday } from './style';

const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * Renders the store's opening hours for "today".
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function StoreAddressHoursToday({ hours }) {
  if (!hours) {
    return null;
  }

  const today = weekdays[new Date().getDay()];
  const hoursToday = hours[today] || null;

  if (!hoursToday || hoursToday === '') {
    return null;
  }

  return (
    <div className={storeHoursToday}>
      {i18n.text('locations.today_hours', { hours: hoursToday })}
    </div>
  );
}

StoreAddressHoursToday.propTypes = {
  hours: PropTypes.shape(),
};

StoreAddressHoursToday.defaultProps = {
  hours: null,
};

export default StoreAddressHoursToday;
