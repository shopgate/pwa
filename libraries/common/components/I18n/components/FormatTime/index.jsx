import React from 'react';
import PropTypes from 'prop-types';

/**
 * Formats a time.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const FormatTime = (props, context) => (
  <span>
    {FormatTime.format(props, context)}
  </span>
);

FormatTime.format = (props, context) => {
  if (!context.i18n) {
    return props.timestamp;
  }

  const { _t } = context.i18n();

  return _t(props.timestamp, props.format);
};

FormatTime.propTypes = {
  timestamp: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  format: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};

FormatTime.defaultProps = {
  format: 'medium',
};

FormatTime.contextTypes = {
  i18n: PropTypes.func,
};

export default FormatTime;
