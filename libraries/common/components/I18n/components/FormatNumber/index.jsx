import React from 'react';
import PropTypes from 'prop-types';

/**
 * Formats a number.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const FormatNumber = (props, context) => (
  <span className={props.className}>
    {FormatNumber.format(props, context)}
  </span>
);

FormatNumber.format = (props, context) => {
  if (!context.i18n) {
    return props.number;
  }

  const { _n } = context.i18n();

  return _n(props.number, props.fractions);
};

FormatNumber.propTypes = {
  number: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  className: PropTypes.string,
  fractions: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
};

FormatNumber.defaultProps = {
  className: '',
  fractions: 0,
};

FormatNumber.contextTypes = {
  i18n: PropTypes.func,
};

export default FormatNumber;
