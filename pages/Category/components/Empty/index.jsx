/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import NoResults from 'Components/NoResults';
import connect from './connector';

/**
 * The price component
 * @param {Object} props The component props
 * @param {string} [props.className] CSS classes
 * @param {string} props.currency The currency of the price
 * @param {number} props.unitPrice The price of the product
 * @param {number} props.unitPriceMin The minimum price of possible child products
 * @param {boolean} props.discounted Tells if the pice is discounted
 * @return {JSX}
 */
const Empty = pure(({ isVisible, ...props }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <NoResults {...props} />
  );
});

Empty.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default connect(Empty);
