import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';

/**
 * Formats a time.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormatTime = props => (
  <span>
    {FormatTime.format(props)}
  </span>
);

FormatTime.format = (props) => {
  if (!i18n.ready) {
    return props.timestamp;
  }

  return i18n.time(props.timestamp, props.format);
};

FormatTime.propTypes = {
  timestamp: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  format: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};

FormatTime.defaultProps = {
  format: 'medium',
};

export default FormatTime;
