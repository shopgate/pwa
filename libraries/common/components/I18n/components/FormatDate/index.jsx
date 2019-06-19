import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';

/**
 * Formats a date.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormatDate = props => (
  <span>
    {FormatDate.format(props)}
  </span>
);

FormatDate.format = (props) => {
  if (!i18n.ready) {
    return props.timestamp;
  }

  return i18n.date(props.timestamp, props.format);
};

FormatDate.propTypes = {
  timestamp: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  format: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};

FormatDate.defaultProps = {
  format: 'medium',
};

export default FormatDate;
