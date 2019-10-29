import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
/**
 * Formats a number.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormatNumber = ({ className, number, fractions }) => {
  if (!className) {
    FormatNumber.format({
      number,
      fractions,
    });
  }

  return (
    <span className={className}>
      {FormatNumber.format({
        number,
        fractions,
      })}
    </span>
  );
};

FormatNumber.format = (props) => {
  if (!i18n.ready) {
    return props.number;
  }

  return i18n.number(props.number, props.fractions);
};

FormatNumber.propTypes = {
  number: PropTypes.number.isRequired,
  className: PropTypes.string,
  fractions: PropTypes.number,
};

FormatNumber.defaultProps = {
  className: null,
  fractions: 0,
};

export default memo(FormatNumber);
