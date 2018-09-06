import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import RatingCount from 'Components/Reviews/components/RatingCount';
import Link from '@shopgate/pwa-common/components/Link';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { container } from './style';
import connect from './connector';

/**
 * The average rating and number of ratings for a product.
 * @param {Object} rating The rating values.
 * @param {string} productId The related product ID.
 * @returns {JSX}
 */
const AverageRating = ({ rating, productId }) => {
  if (!productId) {
    return null;
  }

  const { average = 0, count = 0 } = rating;
  const publicProductId = bin2hex(productId);

  return (
    <Link
      data-test-id="ratedStarsAverage"
      tagName="a"
      href={`${ITEM_PATH}/${publicProductId}/write_review`}
      disabled={!appConfig.showWriteReview}
      className={container}
      itemProp="item"
      itemScope
      itemType="http://schema.org/Review"
    >
      <RatingStars value={average} display="large" />
      <RatingCount count={count} />
    </Link>
  );
};

AverageRating.propTypes = {
  productId: PropTypes.string,
  rating: PropTypes.shape(),
};

AverageRating.defaultProps = {
  rating: {
    average: 0,
    count: 0,
  },
  productId: null,
};

export default connect(AverageRating);
