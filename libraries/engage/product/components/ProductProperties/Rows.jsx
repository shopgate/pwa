import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';
import RowHTML from './RowHTML';

/**
 * Coerces API property values (string or list) to one HTML string for Row / RowHTML.
 * @param {*} value Raw value from product properties payload.
 * @param {Object} options Options.
 * @param {boolean} [options.html=false] If true, concatenate array segments; else join with comma.
 * @returns {string}
 */
const normalizePropertyValue = (value, { html = false } = {}) => {
  if (Array.isArray(value)) {
    const parts = value.map(v => (v == null ? '' : String(v)));
    return html ? parts.join('') : parts.filter(Boolean).join(', ');
  }
  return value == null ? '' : String(value);
};

/**
 * Renders rows of product properties.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Rows = ({ properties }) => properties
  .map(({ value, label, type }) => {
    if (type === 'html') {
      return (
        <RowHTML
          key={label}
          label={label}
          value={normalizePropertyValue(value, { html: true })}
        />
      );
    }

    const displayValue = normalizePropertyValue(value);

    return (
      <Row
        key={`${label}-${displayValue}`}
        label={label}
        type={type}
        value={displayValue}
      />
    );
  });

Rows.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default React.memo(Rows);
