import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core';
import { openingHoursRow, openingHoursDay } from './style';

/**
 * Renders a single opening hours line.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function StoreAddressOpeningHoursLine({ hours, code }) {
  if (!hours || hours === '') {
    return null;
  }

  return (
    <div className={openingHoursRow}>
      <div className={openingHoursDay}>
        {i18n.text(`product.location.${code}`)}
      </div>
      <div data-test-id={`hours-${code}`}>{hours}</div>
    </div>
  );
}

StoreAddressOpeningHoursLine.propTypes = {
  code: PropTypes.string.isRequired,
  hours: PropTypes.string.isRequired,
};

export default StoreAddressOpeningHoursLine;
