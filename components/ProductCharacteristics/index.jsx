/*
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * The Cart Product Properties component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ProductCharacteristics = ({ characteristics }) => (
  <ul>
    {characteristics.map(({ name, value }) => (
      <li key={`${name}-${value}`}>
        {name}: {value}
      </li>
    ))}
  </ul>
);

ProductCharacteristics.propTypes = {
  characteristics: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

ProductCharacteristics.defaultProps = {
  characteristics: [],
};

export default ProductCharacteristics;
