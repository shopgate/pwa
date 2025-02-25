// @flow
import React from 'react';
import { i18n } from '../../../core';
import { openingHoursRow, openingHoursDay } from './Store.style';

type Props = {
  day: string,
  hours?: string,
};

/**
 * Renders a single opening hours line.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StoreOpeningHoursLine({ day, hours }: Props) {
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

StoreOpeningHoursLine.defaultProps = {
  hours: null,
};
