import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import ButtonLink from '@shopgate/pwa-ui-shared/ButtonLink';

/**
 * Link to add a review.
 * @returns {JSX.Element}
 */
const WriteReviewLink = ({ productId }) => (
  <div data-test-id="writeReview" className="engage__reviews__write-review-link">
    <ButtonLink
      href={`${ITEM_PATH}/${bin2hex(productId)}/write_review`}
      noGap
      aria-label={i18n.text('reviews.button_add')}
    >
      <I18n.Text string="reviews.button_add" />
    </ButtonLink>
  </div>
);

WriteReviewLink.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default WriteReviewLink;
