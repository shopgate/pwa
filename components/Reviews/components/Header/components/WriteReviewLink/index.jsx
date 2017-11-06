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
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import styles from './style';
import connect from './connector';

/**
 * Link to add a review.
 * @returns {JSX|null}
 */
const WriteReviewLink = ({ productId }) => {
  if (!productId) {
    return null;
  }

  const publicProductId = bin2hex(productId);

  return (
    <Link href={`${ITEM_PATH}/${publicProductId}/write_review`} className={styles}>
      <I18n.Text string="reviews.button_add" />
    </Link>
  );
};

WriteReviewLink.propTypes = {
  productId: PropTypes.string,
};

WriteReviewLink.defaultProps = {
  productId: null,
};

export default connect(WriteReviewLink);
