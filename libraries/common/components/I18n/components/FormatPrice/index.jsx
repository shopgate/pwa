import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
/**
 * Formats a price.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FormatPrice = props => (
  <span className={props.className}>
    {FormatPrice.format(props)}
  </span>
);

FormatPrice.format = (props) => {
  if (!i18n.ready) {
    return props.price;
  }

  return i18n.price(props.price, props.currency, props.fractions);
};

FormatPrice.propTypes = {
  currency: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  price: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  className: PropTypes.string,
  fractions: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};

FormatPrice.defaultProps = {
  className: '',
  fractions: true,
};

export default FormatPrice;
