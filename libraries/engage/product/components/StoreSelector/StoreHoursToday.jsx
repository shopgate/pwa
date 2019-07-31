import React, { memo } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { storeHoursToday } from './style';

const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * Renders the store's opening hours for "today".
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const StoreHoursToday = ({ hours }) => {
  const today = weekdays[new Date().getDay()];
  const hoursToday = hours[today] || null;

  if (!hoursToday || !hoursToday === '') {
    return null;
  }

  return (
    <div className={storeHoursToday}>
      <I18n.Text string="product.location.today_hours" params={{ hours: hoursToday }} />
    </div>
  );
};

StoreHoursToday.propTypes = {
  hours: PropTypes.shape().isRequired,
};

export default memo(StoreHoursToday);
