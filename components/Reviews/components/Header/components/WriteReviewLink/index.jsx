/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import ButtonLink from 'Components/ButtonLink';
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
    <ButtonLink href={`${ITEM_PATH}/${publicProductId}/write_review`} noGap>
      <I18n.Text string="reviews.button_add" />
    </ButtonLink>
  );
};

WriteReviewLink.propTypes = {
  productId: PropTypes.string,
};

WriteReviewLink.defaultProps = {
  productId: null,
};

export default connect(WriteReviewLink);
