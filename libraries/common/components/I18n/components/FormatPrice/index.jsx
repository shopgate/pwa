import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
/**
 * Formats a price.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormatPrice = (props) => {
  const { className, ...formatProps } = props;

  if (!className) {
    return FormatPrice.format(formatProps);
  }

  return (
    <span className={className}>
      {FormatPrice.format(formatProps)}
    </span>
  );
};

FormatPrice.format = ({ price, currency, fractions }) => {
  if (!i18n.ready) {
    return price;
  }

  return i18n.price(price, currency, fractions);
};

FormatPrice.propTypes = {
  currency: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  className: PropTypes.string,
  fractions: PropTypes.bool,
};

FormatPrice.defaultProps = {
  className: null,
  fractions: true,
};

export default memo(FormatPrice);
