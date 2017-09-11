/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import style from './style';

/**
 * Rating count
 * @param {number} count The number of ratings given for a product
 * @returns {*}
 * @constructor
 */
const RatingCount = ({ count }) => {
  if (!count) {
    return null;
  }

  return (
    <I18n.Text
      string="reviews.review_count"
      params={{ count }}
      className={style.mute}
    />
  );
};

RatingCount.propTypes = {
  count: PropTypes.number,
};

RatingCount.defaultProps = {
  count: null,
};

export default RatingCount;
