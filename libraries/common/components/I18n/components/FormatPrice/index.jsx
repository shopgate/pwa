/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Formats a price.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const FormatPrice = (props, context) => (
  <span className={props.className}>
    {FormatPrice.format(props, context)}
  </span>
);

FormatPrice.format = (props, context) => {
  if (!context.i18n) {
    return props.price;
  }

  const { _p } = context.i18n();

  return _p(props.price, props.currency, props.fractions);
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

FormatPrice.contextTypes = {
  i18n: PropTypes.func,
};

export default FormatPrice;
