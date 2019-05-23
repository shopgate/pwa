import React from 'react';
import PropTypes from 'prop-types';
import { I18n, ButtonLink } from '@shopgate/engage/components';
import { ITEM_PATH } from '@shopgate/engage/product';
import { bin2hex } from '@shopgate/engage/core';

/**
 * Link to add a review.
 * @returns {JSX|null}
 */
const WriteReviewLink = ({ productId }) => (
  <div data-test-id="writeReview">
    <ButtonLink href={`${ITEM_PATH}/${bin2hex(productId)}/write_review`} noGap>
      <I18n.Text string="reviews.button_add" />
    </ButtonLink>
  </div>
);

WriteReviewLink.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default WriteReviewLink;
