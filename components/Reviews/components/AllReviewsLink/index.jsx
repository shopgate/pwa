import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import I18n from '@shopgate/pwa-common/components/I18n';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import ButtonLink from '@shopgate/pwa-ui-shared/ButtonLink';
import { REVIEW_PREVIEW_COUNT } from 'Pages/Product/constants';
import connect from './connector';
import { container } from './style';

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
      <ButtonLink href={`${ITEM_PATH}/${publicProductId}/reviews`}>
        <I18n.Text string="reviews.button_all" params={{ count: totalReviewCount }} />
      </ButtonLink>
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
