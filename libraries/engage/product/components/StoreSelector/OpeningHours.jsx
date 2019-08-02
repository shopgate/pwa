import React, { memo } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { openingHours, openingHoursRow, openingHoursDay } from './style';

/**
 * Renders the store#s opening hours in the store details.
 * @param {Object} props The compnent props.
 * @returns {JSX}
 */
const OpeningHours = ({ hours }) => {
  if (!hours) {
    return null;
  }

  return (
    <div className={openingHours}>
      {Object.keys(hours).map((key) => {
        if (!hours[key] || hours[key] === '') {
          return null;
        }

        return (
          <div className={openingHoursRow} key={key}>
            <div className={openingHoursDay}>
              <I18n.Text string={`product.location.${key}`} />
            </div>
            <div data-test-id={`hours-${key}`}>{hours[key]}</div>
          </div>
        );
      })}
    </div>
  );
};

OpeningHours.propTypes = {
  hours: PropTypes.shape(),
};

OpeningHours.defaultProps = {
  hours: null,
};

export default memo(OpeningHours);
