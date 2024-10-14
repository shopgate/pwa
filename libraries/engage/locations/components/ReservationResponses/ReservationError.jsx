import React from 'react';
import { i18n } from '../../../core/helpers/i18n';
import {
  container, heading, body,
} from './ReservationResponse.style';

/**
 * Renders the reservation error screen.
 * @returns {JSX}
 */
export function ReservationError() {
  return (
    <div className={container}>
      <h2 className={heading}>
        {i18n.text('locations.error_title')}
      </h2>
      <p className={body}>
        {i18n.text('locations.error_copy')}
      </p>
    </div>
  );
}
