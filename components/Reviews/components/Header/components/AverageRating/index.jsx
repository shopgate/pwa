import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import RatingCount from 'Components/Reviews/components/RatingCount';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import connect from './connector';
import { container } from './style';

/**
 * The average rating and number of ratings for a product.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AverageRating = ({ rating, productId }) => {
  if (!productId) {
    return null;
  }

  return (
    <Link
      tagName="a"
      href={`${ITEM_PATH}/${bin2hex(productId)}/write_review`}
      className={container}
      itemProp="item"
      itemScope
      itemType="http://schema.org/Review"
    >
      <RatingStars value={rating.average} display="large" />
      <RatingCount count={rating.count} />
    </Link >
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
