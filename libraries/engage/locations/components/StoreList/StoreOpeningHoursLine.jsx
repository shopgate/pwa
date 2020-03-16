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
    <div className={openingHoursRow}>
      <div className={openingHoursDay}>
        {i18n.text(`locations.${day}`)}
      </div>
      <div>{hours}</div>
    </div>
  );
}

StoreOpeningHoursLine.defaultProps = {
  hours: null,
};
