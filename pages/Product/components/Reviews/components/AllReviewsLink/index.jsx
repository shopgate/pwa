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
import connect from './connector';
import styles from './style';

const REVIEW_PREVIEW_LIMIT = 2;

/**
 * Link to all reviews
 * @param {number} totalReviewCount The number of reviews given
 * @returns {null|JSX}
 */
const AllReviewsLink = ({ totalReviewCount }) => {
  if (totalReviewCount < REVIEW_PREVIEW_LIMIT) {
    return null;
  }

  return (
    <Link href="/" className={styles.button}>
      <I18n.Text string="reviews.button_all" params={[totalReviewCount]} />
    </Link>
  );
};

AllReviewsLink.propTypes = {
  totalReviewCount: PropTypes.number,
};

AllReviewsLink.defaultProps = {
  totalReviewCount: null,
};

export default connect(AllReviewsLink);
