import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
/**
 * Formats a number.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormatNumber = props => (
  <span className={props.className}>
    {FormatNumber.format(props)}
  </span>
);

FormatNumber.format = (props) => {
  if (!i18n.ready) {
    return props.number;
  }
  return i18n.number(props.number, props.fractions);
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

export default FormatNumber;
