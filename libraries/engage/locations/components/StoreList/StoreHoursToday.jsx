// @flow
import React from 'react';
import { i18n } from '../../../core';
import { type LocationOperationHours } from '../../locations.types';
import { storeHoursToday } from './Store.style';

const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

type Props = {
  hours?: LocationOperationHours,
  longLabel?: bool,
};

/**
 * Renders the store's opening hours for "today".
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StoreHoursToday({ hours, longLabel }: Props) {
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

StoreHoursToday.defaultProps = {
  hours: null,
  longLabel: false,
};
