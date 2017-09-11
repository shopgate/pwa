/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import style from './style';

/**
 * Review Text Component
 * @param {string} review The review text
 * @returns {XML}
 * @constructor
 */
const Text = ({ review }) => (
  <div className={style.text}>{`"${review}"`}</div>
);

Text.propTypes = {
  review: PropTypes.string,
};

Text.defaultProps = {
  review: null,
};

export default Text;
