/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import { REVIEW_PREVIEW_LIMIT } from 'Pages/Product/constants';
import connect from './connector';
import styles from './style';

/**
 * Link to all reviews.
 * @param {string} productId ProductId.
 * @param {number} totalReviewCount The number of reviews given.
 * @returns {JSX|null}
 */
const AllReviewsLink = ({ productId, totalReviewCount }) => {
  if (totalReviewCount < REVIEW_PREVIEW_LIMIT) {
    return null;
  }

  const publicProductId = bin2hex(productId);

  return (
    <Link href={`/item/${publicProductId}/reviews`} className={styles}>
      <I18n.Text string="reviews.button_all" params={{ count: totalReviewCount }} />
    </Link>
  );
};

AllReviewsLink.propTypes = {
  productId: PropTypes.string.isRequired,
  totalReviewCount: PropTypes.number,
};

AllReviewsLink.defaultProps = {
  totalReviewCount: null,
};

export default connect(AllReviewsLink);
