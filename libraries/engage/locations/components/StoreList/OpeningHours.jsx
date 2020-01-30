import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { openingHours, openingHoursRow, openingHoursDay } from './style';

/**
 * Renders the store's opening hours.
 * @param {Object} props The compnent props.
 * @returns {JSX}
 */
function OpeningHours({ hours }) {
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
              {i18n.text(`product.location.${key}`)}
            </div>
            <div data-test-id={`hours-${key}`}>{hours[key]}</div>
          </div>
        );
      })}
    </div>
  );
}

OpeningHours.propTypes = {
  hours: PropTypes.shape(),
};

OpeningHours.defaultProps = {
  hours: null,
};

export default OpeningHours;
