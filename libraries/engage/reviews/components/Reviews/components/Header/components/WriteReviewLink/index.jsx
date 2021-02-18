import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import ButtonLink from '@shopgate/pwa-ui-shared/ButtonLink';

/**
 * Link to add a review.
 * @returns {JSX|null}
 */
const WriteReviewLink = ({ productId }) => (
  <div data-test-id="writeReview" aria-hidden>
    <ButtonLink href={`${ITEM_PATH}/${bin2hex(productId)}/write_review`} noGap>
      <I18n.Text string="reviews.button_add" />
    </ButtonLink>
  </div>
);

WriteReviewLink.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default WriteReviewLink;
