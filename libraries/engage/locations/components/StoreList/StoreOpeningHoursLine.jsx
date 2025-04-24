import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core';
import { openingHoursRow, openingHoursDay } from './Store.style';

/**
 * Renders a single opening hours line.
 * @param {Object} props The component props.
 * @param {string} props.day The day.
 * @param {string} props.hours The hours line.
 * @returns {JSX.Element}
 */
export function StoreOpeningHoursLine({ day, hours }) {
  if (!hours || hours === '') {
    return null;
  }

  return (
    <tr
      className={openingHoursRow}
      aria-label={`${i18n.text(`locations.${day}`)}: ${hours}`}
      tabIndex={0}
      role="row"
    >
      <td className={openingHoursDay} aria-hidden>
        {i18n.text(`locations.${day}`)}
      </td>
      <td aria-hidden>
        {hours}
      </td>
    </tr>
  );
}

StoreOpeningHoursLine.propTypes = {
  day: PropTypes.string.isRequired,
  hours: PropTypes.string,
};

StoreOpeningHoursLine.defaultProps = {
  hours: null,
};
