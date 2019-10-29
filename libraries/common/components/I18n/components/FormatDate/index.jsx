import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';

/**
 * Formats a date.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormatDate = ({ timestamp, format }) => (
  <Fragment>
    {FormatDate.format({
      timestamp,
      format,
    })}
  </Fragment>
);

FormatDate.format = ({ timestamp, format }) => {
  if (!i18n.ready) {
    return timestamp;
  }

  return i18n.date(timestamp, format);
};

FormatDate.propTypes = {
  timestamp: PropTypes.number.isRequired,
  format: PropTypes.string,
};

FormatDate.defaultProps = {
  format: 'medium',
};

export default memo(FormatDate);
