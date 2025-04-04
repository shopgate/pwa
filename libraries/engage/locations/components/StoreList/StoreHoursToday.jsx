import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core';
import { storeHoursToday } from './Store.style';

const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * Renders the store's opening hours for "today".
 * @param {Object} props The component props.
 * @param {Object} props.hours The store's opening hours.
 * @param {boolean} props.longLabel Whether to render the opening hours with a long label
 * @returns {JSX.Element}
 */
export function StoreHoursToday({ hours, longLabel }) {
  if (!hours) {
    return null;
  }

  const today = weekdays[new Date().getDay()];
  const hoursToday = hours[today] || null;

  if (!hoursToday || hoursToday === '') {
    return null;
  }

  const label = longLabel ? 'locations.today_hours_long' : 'locations.today_hours';

  return (
    <div className={storeHoursToday}>
      {i18n.text(label, { hours: hoursToday })}
    </div>
  );
}

StoreHoursToday.propTypes = {
  hours: PropTypes.shape(),
  longLabel: PropTypes.bool,
};

StoreHoursToday.defaultProps = {
  hours: null,
  longLabel: false,
};
