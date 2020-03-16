// @flow
import React from 'react';
import { i18n } from '../../../core';
import { type LocationOperationHours } from '../../locations.types';
import { storeHoursToday } from './Store.style';

const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

type Props = {
  hours?: LocationOperationHours,
};

/**
 * Renders the store's opening hours for "today".
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StoreHoursToday({ hours }: Props) {
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

StoreHoursToday.defaultProps = {
  hours: null,
};
