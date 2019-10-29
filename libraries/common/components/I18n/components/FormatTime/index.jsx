import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';

/**
 * Formats a time.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormatTime = ({ timestamp, format }) => (
  <Fragment>
    {FormatTime.format({
      timestamp,
      format,
    })}
  </Fragment>
);

FormatTime.format = ({ timestamp, format }) => {
  if (!i18n.ready) {
    return timestamp;
  }

  return i18n.time(timestamp, format);
};

FormatTime.propTypes = {
  timestamp: PropTypes.number.isRequired,
  format: PropTypes.string,
};

FormatTime.defaultProps = {
  format: 'medium',
};

export default memo(FormatTime);
