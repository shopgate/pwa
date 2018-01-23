/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { greyStyle, prominentStyle } from './style';

/**
 * Rating count.
 * @param {number} count The number of ratings given for a product.
 * @param {bool} prominent Text should be prominent,
 * @returns {JSX|null}
 */
const RatingCount = ({ count, prominent }) => {
  if (!count) {
    return null;
  }
  const styles = prominent ? prominentStyle : greyStyle;

  return <I18n.Text string="reviews.review_count" params={{ count }} className={styles} />;
};

RatingCount.propTypes = {
  count: PropTypes.number,
  prominent: PropTypes.bool,
};

RatingCount.defaultProps = {
  count: null,
  prominent: false,
};

export default RatingCount;
