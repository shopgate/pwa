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
import { REVIEW_PREVIEW_COUNT } from 'Pages/Product/constants';
import connect from './connector';
import {
  container,
  link,
} from './style';

/**
 * Link to all reviews.
 * @param {string} productId The product id.
 * @param {number} totalReviewCount The total number of reviews for the product.
 * @returns {JSX|null}
 */
const AllReviewsLink = ({ productId, totalReviewCount }) => {
  if (!productId || totalReviewCount <= REVIEW_PREVIEW_COUNT) {
    return null;
  }

  const publicProductId = bin2hex(productId);

  return (
    <div className={container}>
      <Link href={`/item/${publicProductId}/reviews`} className={link}>
        <I18n.Text string="reviews.button_all" params={{ count: totalReviewCount }} />
      </Link>
    </div>
  );
};

AllReviewsLink.propTypes = {
  productId: PropTypes.string,
  totalReviewCount: PropTypes.number,
};

AllReviewsLink.defaultProps = {
  productId: null,
  totalReviewCount: null,
};

export default connect(AllReviewsLink);
