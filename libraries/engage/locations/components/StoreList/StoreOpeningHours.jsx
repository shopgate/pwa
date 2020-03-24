// @flow
import React from 'react';
import { every, isEmpty } from 'lodash';
import { getWeekDaysOrder } from '@shopgate/engage/core';
import { I18n, TimeIcon } from '@shopgate/engage/components';
import { type LocationOperationHours } from '../../locations.types';
import { StoreDetailsLine } from './StoreDetailsLine';
import { StoreOpeningHoursLine } from './StoreOpeningHoursLine';
import { openingHours, detailsSecondary } from './Store.style';

type Props = {
  hours?: LocationOperationHours,
  pure?: boolean
}

/**
 * Renders the store's opening hours.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StoreOpeningHours({ hours, pure }: Props) {
  if (!hours || every(hours, isEmpty)) {
    return null;
  }

  const storeHours = (
    <div className={openingHours}>
      {getWeekDaysOrder().map(weekDay => (
        <StoreOpeningHoursLine hours={hours[weekDay]} day={weekDay} key={weekDay} />
      ))}
    </div>
  );

  if (pure) {
    return storeHours;
  }

  return (
    <StoreDetailsLine icon={TimeIcon}>
      <I18n.Text string="locations.hours_details" className={detailsSecondary} />
      {storeHours}
    </StoreDetailsLine>
  );
}

StoreOpeningHours.defaultProps = {
  hours: null,
  pure: false,
};
