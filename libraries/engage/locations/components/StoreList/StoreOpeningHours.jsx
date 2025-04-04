import React from 'react';
import PropTypes from 'prop-types';
import { every, isEmpty } from 'lodash';
import { getWeekDaysOrder } from '@shopgate/engage/core';
import { I18n, TimeIcon } from '@shopgate/engage/components';
import { StoreDetailsLine } from './StoreDetailsLine';
import { StoreOpeningHoursLine } from './StoreOpeningHoursLine';
import { openingHours, detailsSecondary } from './Store.style';

/**
 * Renders the store's opening hours.
 * @param {Object} props The component props.
 * @param {Object} props.hours The store's opening hours.
 * @param {boolean} props.pure Whether to render the opening hours without any wrapper components
 * @returns {JSX.Element}
 */
export function StoreOpeningHours({ hours, pure }) {
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

StoreOpeningHours.propTypes = {
  hours: PropTypes.shape(),
  pure: PropTypes.bool,
};

StoreOpeningHours.defaultProps = {
  hours: null,
  pure: false,
};
