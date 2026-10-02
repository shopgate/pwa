import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { Button } from '@shopgate/engage/components/v2';

/**
 * Link to add a review.
 * @returns {JSX.Element}
 */
const WriteReviewLink = ({ productId, fullWidth }) => (
  <div
    data-test-id="writeReview"
    className="engage__reviews__write-review-link"
    data-full-width={fullWidth || undefined}
  >
    <Button
      variant="text"
      color="primary"
      fullWidth={fullWidth}
      href={`${ITEM_PATH}/${bin2hex(productId)}/write_review`}
      aria-label={i18n.text('reviews.button_add')}
    >
      <I18n.Text string="reviews.button_add" />
    </Button>
  </div>
);

WriteReviewLink.propTypes = {
  productId: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
};

WriteReviewLink.defaultProps = {
  fullWidth: false,
};

export default WriteReviewLink;
