import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_RATING,
  PRODUCT_RATING_AFTER,
  PRODUCT_RATING_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import appConfig from '@shopgate/pwa-common/helpers/config';
import RatingStars from '@shopgate/pwa-ui-shared/RatingStars';
import RatingCount from '@shopgate/engage/reviews/components/Reviews/components/RatingCount';
import { container } from './style';
import connect from './connector';

/**
 * Scrolls page to reviews excerpt.
 */
const scrollToRating = () => {
  const reviewsExcerpt = document.getElementById('reviewsExcerpt');

  if (
    typeof reviewsExcerpt !== 'object' ||
    !reviewsExcerpt ||
    !reviewsExcerpt.offsetTop ||
    !reviewsExcerpt.closest ||
    !reviewsExcerpt.closest('article')
  ) {
    return;
  }

  reviewsExcerpt
    .closest('article')
    .scroll(0, reviewsExcerpt.offsetTop - 30);
};

/**
 * The Rating component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Rating = ({ rating }) => {
  // TODO: get value from real theme config
  const showEmptyRatingStars = false;

  // TODO: move into a nice one liner
  let showRatings;
  if (showEmptyRatingStars) {
    showRatings = appConfig.hasReviews && rating;
  } else {
    showRatings = appConfig.hasReviews && rating && rating.count;
  }

  return (
    <Fragment>
      <Portal name={PRODUCT_RATING_BEFORE} />
      <Portal name={PRODUCT_RATING}>
        {showRatings &&
        <div
          className={`${container} engage__product__rating`}
          onClick={scrollToRating}
          role="link"
          aria-hidden
        >
          <RatingStars value={rating.average} display="big" />
          <RatingCount count={rating.count} prominent />
        </div>
        }
      </Portal>
      <Portal name={PRODUCT_RATING_AFTER} />
    </Fragment>);
};
Rating.propTypes = {
  rating: PropTypes.shape(),
};

Rating.defaultProps = {
  rating: null,
};

export default connect(memo(Rating));
