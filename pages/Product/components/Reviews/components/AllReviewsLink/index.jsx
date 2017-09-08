/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import style from './style';

/**
 * Link to all reviews
 * @constructor
 */
const AllReviewsLink = ({ count }) => (
  <Link href="/" className={style.button}>
    <I18n.Text string="reviews.button_all" params={[count]} />
  </Link>
);

AllReviewsLink.propTypes = {
  count: PropTypes.number,
};

AllReviewsLink.defaultProps = {
  count: null,
};

export default AllReviewsLink;
