import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import RatingCount from 'Components/Reviews/components/RatingCount';
import Link from '@shopgate/pwa-common/components/Link';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { container } from './style';

/**
 * The average rating and number of ratings for a product.
 * @param {Object} rating The rating values.
 * @param {string} productId The related product ID.
 * @returns {JSX}
 */
const AverageRating = ({ average, count, productId }) => {
  if (!productId) {
    return null;
  }
  return (
    <Link
      data-test-id="ratedStarsAverage"
      tagName="a"
      href={`${ITEM_PATH}/${bin2hex(productId)}/write_review`}
      disabled={!appConfig.showWriteReview}
      className={container}
      itemProp="item"
      itemScope
      itemType="http://schema.org/Review"
      // eslint-disable-next-line jsx-a11y/aria-role
      role="text"
    >
      <RatingStars value={average} display="large" />
      <RatingCount count={count} />
    </Link>
  );
};

AverageRating.propTypes = {
  average: PropTypes.number,
  count: PropTypes.number,
  productId: PropTypes.string,
};

AverageRating.defaultProps = {
  average: 0,
  count: 0,
  productId: null,
};

export default AverageRating;
